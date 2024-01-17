'use strict';
export default App => {
	return new class {
		Make(Afferent){
			const Type = [
				false ,
				'application/x-www-form-urlencoded;charset=UTF-8' ,
				'application/json;charset=UTF-8' ,
				'multipart/form-data;charset=UTF-8' ,
				'text/html;charset=UTF-8' ,
				'text/plain;charset=UTF-8' ,
				'text/xml;charset=UTF-8' ,
				'application/octet-stream' ,
			];
			const Response = {};
			if(!App.Verify.Object(Afferent)) Afferent = {};
			Response.url = (App.Verify.Require(Afferent.Url , 'string') ? Afferent.Url : window.location.origin);
			if(App.Verify.Require(Afferent.Query , ['string' , 'object'])){
				Response.url = App.String.Concat(Response.url , (App.Verify.In(Response.url , '?') ? '&' : '?'));
				if(App.Verify.String(Afferent.Query)) Response.url = App.String.Concat(Response.url , Afferent.Query);
				if(App.Verify.Object(Afferent.Query)) Response.url = App.String.Concat(Response.url , App.Object.Url(Afferent.Query));
			}
			Response.contentType = Type[(App.Verify.Number(Afferent.Type) && App.Verify.Between(Afferent.Type , 0 , 7) ? Afferent.Type : 2)];
			Response.processData = (App.Verify.In([Type[0] , Type[3]] , Response.contentType) ? false : (App.Verify.Boolean(Afferent.Process) ? Afferent.Process : true));
			Response.async = (App.Verify.Boolean(Afferent.Async) ? Afferent.Async : true);
			Response.cache = (App.Verify.Boolean(Afferent.Cache) ? Afferent.Cache : true);
			Response.type = (App.Verify.String(Afferent.Method) && App.Verify.In(['get' , 'post' , 'put' , 'delete'] , App.String.Lower(Afferent.Method)) ? App.String.Lower(Afferent.Method) : 'post');
			Response.dataType = (App.Verify.String(Afferent.Mold) && App.Verify.Confirm(Afferent.Mold , 'text') ? Afferent.Mold : 'json');
			Response.ifModified = (App.Verify.Boolean(Afferent.Modified) ? Afferent.Modified : false);
			Response.timeout = (App.Verify.Number(Afferent.Timeout) && App.Verify.Gt(Afferent.Timeout , 0) ? App.Calculate.Mul(Afferent.Timeout , 1000) : 60000);
			Response.dataFilter = (App.Verify.Function(Afferent.Filter) ? Afferent.Filter : (Data , Type) => {
				return Data;
			});
			Response.beforeSend = (App.Verify.Function(Afferent.Before) ? Afferent.Before : Xhr => {});
			Response.xhr = () => {
				const Xhr = App.$.ajaxSettings.xhr();
				if(Xhr.upload) Xhr.upload.onprogress = Data => {
					const Percent = App.Calculate.Mul(App.Calculate.Div(Data.loaded , Data.total) , 100);
					if(App.Verify.Function(Afferent.Xhr)) Afferent.Xhr(Percent);
				}
				return Xhr;
			}
			Response.error = (Xhr , Status , Exception) => {
				const Message = (App.Verify.Confirm(App.String.Lower(Xhr.statusText) , 'ok') ? Xhr.responseText : Exception);
				if(App.Verify.Function(Afferent.Error)) Afferent.Error(Message);
			}
			if(App.Verify.Function(Afferent.Success)) Response.success = Afferent.Success;
			Response.complete = (Xhr , Status) => {
				if(App.Verify.Function(Afferent.Complete)) Afferent.Complete();
			}
			Response.data = ((Data = (() => {
				if(App.Verify.Function(Afferent.Data)) Afferent.Data = Afferent.Data();
				if(App.Verify.Boolean(Afferent.Data)) return [Afferent.Data];
				if(App.Verify.Type(Afferent.Data , ['string' , 'number'])) return [App.String.Convert(Afferent.Data)];
				return (App.Verify.Object(Afferent.Data) ? Afferent.Data : {});
			})()) => {
				if(App.Verify.In([Type[0] , Type[3]] , Response.contentType)){
					const Form = new FormData();
					App.Each.In(Data , (Index , Item) => {
						Form.append(Index , Item);
						return true;
					});
					return Form;
				}else if(App.Verify.Confirm(Type[2] , Response.contentType)){
					return App.Object.Json(Data);
				}
				return Data;
			})();
			return Response;
		}
		async Ajax(Afferent){
			if(App.Verify.Array(Afferent)){
				const Request = [];
				App.Each.Of(Afferent , Item => {
					App.Array.Push(Request , this.Make(Item));
					const Index = App.Calculate.Sub(App.Util.Length(Request) , 1);
					const Wait = App.$.ajax(Request[Index]);
					if(!App.Verify.Function(Request[Index].success)) Request[Index].wait = Wait;
				});
				const Array = [];
				for(const Item of Request){
					if(App.Verify.Undefined(Item.wait)) continue;
					const Data = await Item.wait;
					App.Array.Push(Array , Data);
				}
				return Array;
			}else{
				const Request = this.Make(Afferent);
				Request.wait = App.$.ajax(Request);
				return (await Request.wait);
			}
		}
		Get(Afferent){
			const Option = (App.Verify.String(Afferent) ? {
				Url : Afferent ,
			} : (App.Verify.Object(Afferent) ? Afferent : {}));
			if(App.Verify.Array(Option)) App.Each.In(Option , (Index , Item) => {
				Option[Index].Method = 'get';
				Option[Index].Type = 1;
				return true;
			});
			if(App.Verify.Object(Option) && !App.Verify.Array(Option)){
				Option.Method = 'get';
				Option.Type = 1;
			}
			return this.Ajax(Option);
		}
		Post(Afferent){
			const Option = (App.Verify.String(Afferent) ? {
				Url : Afferent ,
			} : (App.Verify.Object(Afferent) ? Afferent : {}));
			if(App.Verify.Array(Option)) App.Each.In(Option , (Index , Item) => {
				Option[Index].Method = 'post';
				return true;
			});
			if(App.Verify.Object(Option) && !App.Verify.Array(Option)) Option.Method = 'post';
			return this.Ajax(Option);
		}
		Put(Afferent){
			const Option = (App.Verify.String(Afferent) ? {
				Url : Afferent ,
			} : (App.Verify.Object(Afferent) ? Afferent : {}));
			if(App.Verify.Array(Option)) App.Each.In(Option , (Index , Item) => {
				Option[Index].Method = 'put';
				return true;
			});
			if(App.Verify.Object(Option) && !App.Verify.Array(Option)) Option.Method = 'put';
			return this.Ajax(Option);
		}
		Delete(Afferent){
			const Option = (App.Verify.String(Afferent) ? {
				Url : Afferent ,
			} : (App.Verify.Object(Afferent) ? Afferent : {}));
			if(App.Verify.Array(Option)) App.Each.In(Option , (Index , Item) => {
				Option[Index].Method = 'delete';
				return true;
			});
			if(App.Verify.Object(Option) && !App.Verify.Array(Option)) Option.Method = 'delete';
			return this.Ajax(Option);
		}
		Socket(Afferent){
			if(!App.Verify.Object(Afferent)) Afferent = {};
			Afferent.WSShut = false;
			Afferent.WSCount = 0;
			Afferent.WSWaitcall = {};
			Afferent.WSSocket = window.WebSocket;
			if(!App.Verify.Require(Afferent.Link , 'string')) Afferent.Link = window.location.hostname;
			if(!App.Verify.Object(Afferent.Query)) Afferent.Query = {};
			if(!App.Verify.Number(Afferent.Max) || App.Verify.Lt(Afferent.Max , -2)) Afferent.Max = 0;
			if(!App.Verify.Number(Afferent.Interval) || App.Verify.Lt(Afferent.Interval , 0)) Afferent.Interval = 5;
			if(!App.Verify.String(Afferent.Method) || !App.Verify.In(['url' , 'json'] , Afferent.Method)) Afferent.Method = 'json';
			if(!App.Verify.String(Afferent.Callcode)) Afferent.Callcode = '';
			if(!App.Verify.String(Afferent.AESKey)) Afferent.AESKey = '';
			if(!App.Verify.String(Afferent.AESIv)) Afferent.AESIv = '';
			if(!App.Verify.String(Afferent.Append)) Afferent.Append = '';
			if(!App.Verify.Function(Afferent.Open)) Afferent.Open = () => {};
			if(!App.Verify.Function(Afferent.Receive)) Afferent.Receive = () => {};
			if(!App.Verify.Function(Afferent.Close)) Afferent.Close = () => {};
			if(!App.Verify.Function(Afferent.Error)) Afferent.Error = () => {};
			if(!App.Verify.Function(Afferent.Relink)) Afferent.Relink = () => {};
			Afferent.WSCallable = new class {
				Send(...Option){
					let [Data , Callable] = Option;
					if(!App.Verify.Eq(Afferent.WSConnect.readyState , 1) || !App.Verify.Require(Data , ['string' , 'number' , 'object'])) return false;
					if(App.Verify.Object(Data)){
						if(App.Verify.Function(Callable) && !App.Verify.Empty(Afferent.Callcode)){
							if(App.Verify.Undefined(Data[Afferent.Callcode])) Data[Afferent.Callcode] = App.String.Uniqid(false);
							Afferent.WSWaitcall[App.Cypher.Md5(Data[Afferent.Callcode])] = Callable;
						}
						Data = (App.Verify.Confirm(Afferent.Method , 'json') ? App.Object.Json(Data) : App.Object.Url(Data));
					}
					if(!App.Verify.String(Data)) Data = App.String.Convert(Data);
					if(!App.Verify.Empty(Afferent.AESKey) && !App.Verify.Empty(Afferent.AESIv)) Data = App.Cypher.Aes.Encode(Data , Afferent.AESKey , Afferent.AESIv);
					if(!App.Verify.Empty(Afferent.Append)) Data = App.String.Concat(Data , Afferent.Append);
					Afferent.WSConnect.send(Data);
				}
				Close(Callable){
					if(Afferent.WSShut) return false;
					Afferent.WSShut = true;
					Afferent.WSConnect.close();
					if(App.Verify.Function(Callable)) Callable();
				}
			}
			Afferent.WSCall = new class {
				Init(){
					if(App.Verify.Eq(Afferent.Max , -1) || App.Verify.Gt(Afferent.Max , Afferent.WSCount)) Afferent.WSShut = false;
					const Link = (App.Verify.Empty(Afferent.Query) ? Afferent.Link : App.String.Concat(Afferent.Link , (App.Verify.In(Afferent.Link , '?') ? '&' : '?') , App.Object.Url(Afferent.Query)));
					Afferent.WSConnect = new Afferent.WSSocket(Link);
					this.Open();
					this.Receive();
					this.Close();
					this.Error();
				}
				Open(){
					Afferent.WSConnect.onopen = Event => {
						return Afferent.Open(Afferent.WSCallable);
					}
				}
				Receive(){
					Afferent.WSConnect.onmessage = Event => {
						let Data = Event.data;
						Data = (App.Verify.Empty(Afferent.Append) ? [Data] : App.String.Split(Data , Afferent.Append));
						App.Each.Of(Data , Item => {
							if(App.Verify.Empty(Item)) return true;
							if(!App.Verify.Empty(Afferent.AESKey) && !App.Verify.Empty(Afferent.AESIv)) Item = App.Cypher.Aes.Decode(Item , Afferent.AESKey , Afferent.AESIv);
							Item = (App.Verify.Confirm(Afferent.Method , 'json') ? App.String.Json(Item) : App.String.Url(Item));
							if(App.Verify.Require(Item[Afferent.Callcode] , 'string') && App.Verify.Function(Afferent.WSWaitcall[App.Cypher.Md5(Item[Afferent.Callcode])])){
								const WSWaitcall = Afferent.WSWaitcall[App.Cypher.Md5(Item[Afferent.Callcode])];
								delete Afferent.WSWaitcall[App.Cypher.Md5(Item[Afferent.Callcode])];
								delete Item[Afferent.Callcode];
								return WSWaitcall(Item);
							}
							return Afferent.Receive(Item , Afferent.WSCallable);
						});
					}
				}
				Close(){
					Afferent.WSConnect.onclose = Event => {
						if(!Afferent.WSShut){
							Afferent.Close(Event);
							if(App.Verify.Eq(Afferent.Max , -1) || App.Verify.Gt(Afferent.Max , Afferent.WSCount)){
								Afferent.WSCount = App.Calculate.Add(Afferent.WSCount , 1);
								Afferent.Relink(Event);
								App.Util.Timeout(() => {
									Afferent.WSCall.Init();
								} , Afferent.Interval);
							}
						}
						Afferent.WSShut = true;
					}
				}
				Error(){
					Afferent.WSConnect.onerror = Event => {
						return Afferent.Error(Event);
					}
				}
			}
			return Afferent.WSCall.Init();
		}
		Stream(Afferent){
			if(!App.Verify.Object(Afferent)) Afferent = {};
			if(!App.Verify.Require(Afferent.Link , 'string')) Afferent.Link = window.location.hostname;
			if(!App.Verify.Object(Afferent.Query)) Afferent.Query = {};
			if(!App.Verify.Function(Afferent.Open)) Afferent.Open = () => {};
			if(!App.Verify.Function(Afferent.Receive)) Afferent.Receive = () => {};
			if(!App.Verify.Function(Afferent.Error)) Afferent.Error = () => {};
			const Link = (App.Verify.Empty(Afferent.Query) ? Afferent.Link : App.String.Concat(Afferent.Link , (App.Verify.In(Afferent.Link , '?') ? '&' : '?') , App.Object.Url(Afferent.Query)));
			Afferent.Stream = new EventSource(Link);
			Afferent.Stream.onopen = Source => {
				Afferent.Open(Source , Afferent.Stream);
			}
			Afferent.Stream.onmessage = Source => {
				Afferent.Receive(App.String.Json(Source.data) , Afferent.Stream);
			}
			Afferent.Stream.onerror = Source => {
				Afferent.Error(Source , Afferent.Stream);
			}
		}
	}
}