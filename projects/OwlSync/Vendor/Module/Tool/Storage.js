'use strict';
export default App => {
	return new class {
		Db(Afferent){
			if(!App.Verify.Object(Afferent)) Afferent = {};
			const Option = {};
			Option.IDBAffair = false;
			Option.IDBIndexed = (window.indexedDB || window.webikitIndexedDB || window.mozIndexedDB || window.msIndexedDB);
			Option.IDBKeyRange = (window.IDBKeyRange || window.webkitIDBKeyRange || window.mozIDBKeyRange || window.msIDBKeyRange);
			Option.IDBDatabase = (App.Verify.Require(Afferent.Database , 'string') ? Afferent.Database : 'database');
			Option.IDBPrefix = (App.Verify.Require(Afferent.Prefix , 'string') ? Afferent.Prefix : '');
			Option.IDBVersion = (App.Verify.Number(Afferent.Version) && App.Verify.Gt(Afferent.Version , 0) ? Afferent.Version : 1);
			Option.IDBCypher = (App.Verify.Boolean(Afferent.Cypher) ? Afferent.Cypher : true);
			Option.IDBTable = (App.Verify.Require(Afferent.Table , 'object') ? Afferent.Table : {table : {}});
			Option.IDBStore = {};
			App.Each.In(Option.IDBTable , (Index , Item) => {
				if(!App.Verify.Object(Item)) Item = {};
				if(!App.Verify.Require(Item.Path , 'string')) Item.Path = 'id';
				if(!App.Verify.Boolean(Item.Auto)) Item.Auto = true;
				if(!App.Verify.Array(Item.Index)) Item.Index = [];
				App.Each.In(Item.Index , (IIndex , IItem) => {
					if(App.Verify.Require(IItem.Key , ['string' , 'array'])){
						if(!App.Verify.Boolean(IItem.Unique)) IItem.Unique = false;
						if(!App.Verify.Boolean(IItem.Multi)) IItem.Multi = false;
						Item.Index[IIndex] = IItem;
					}else{
						delete Item.Index[IIndex];
					}
				});
				Option.IDBStore[App.String.Concat(Option.IDBPrefix , '_' , Index)] = Item;
			});
			Option.IDBCallable = new class {
				Each(Source , Callable , Symbol , Callback , Cursor){
					if(App.Verify.Array(Source) && (App.Verify.String(Cursor) || (App.Verify.Array(Source) && App.Verify.Array(Source[0])))){
						const Array = [];
						let Count = 0;
						App.Each.Of(Source , Item => {
							const IDBObject = Callable(Item , false);
							IDBObject.onsuccess = () => {
								if(App.Verify.Eq(Symbol , 1)){
									if(IDBObject.result){
										if(App.Verify.Function(IDBObject.result.continue)){
											App.Array.Push(Array , Callable(IDBObject.result.value , true));
											IDBObject.result.continue();
										}else{
											Count = App.Calculate.Add(Count , 1);
											App.Array.Push(Array , IDBObject.result);
											if(App.Verify.Length(Source , Count)) return Callback({
												Status : 1 ,
												Data : (App.Verify.Length(Array , 1) ? Array[0] : Array) ,
											});
										}
									}else{
										Count = App.Calculate.Add(Count , 1);
										if(App.Verify.Length(Source , Count)) return Callback({
											Status : 1 ,
											Data : (App.Verify.Length(Array , 1) ? Array[0] : Array) ,
										});
									}
								}else{
									Count = App.Calculate.Add(Count , 1);
									const Data = (App.Verify.Eq(Symbol , 3) ? Item : IDBObject.result);
									App.Array.Push(Array , Data);
									if(App.Verify.Length(Source , Count)) return Callback({
										Status : 1 ,
										Data : (App.Verify.Length(Array , 1) ? Array[0] : Array) ,
									});
								}
							}
							IDBObject.onerror = () => {
								return Callback({
									Status : 0 ,
									Error : IDBObject.error ,
								});
							}
							return true;
						});
					}else{
						const Array = [];
						const IDBObject = Callable(Source , false);
						IDBObject.onsuccess = () => {
							if(IDBObject.result){
								if(App.Verify.Function(IDBObject.result.continue)){
									App.Array.Push(Array , App.Callable(IDBObject.result.value , true));
									IDBObject.result.continue();
								}else{
									return Callback({
										Status : 1 ,
										Data : (App.Verify.Eq(Symbol , 3) ? Source : (App.Verify.Eq(Symbol , 2) ? IDBObject.result : Callable(IDBObject.result , true))) ,
									});
								}
							}else{
								return Callback({
									Status : 1 ,
									Data : (App.Verify.Eq(Symbol , 3) ? Source : (App.Verify.Eq(Symbol , 2) ? IDBObject.result : (App.Verify.Length(Array , 1) ? Array[0] : Array))) ,
								});
							}
						}
						IDBObject.onerror = () => {
							return Callback({
								Status : 0 ,
								Error : IDBObject.error ,
							});
						}
					}
				}
				Encode(Table , Source){
					const IDBObject = {};
					App.Each.In(Source , ((Index , Item) => {
						IDBObject[Index] = (App.Verify.Confirm(Index , Table.Path) ? Item : App.Cypher.Aes.Encode(Item , Index , Index));
						return true;
					}));
					return IDBObject;
				}
				Decode(Table , Source){
					const IDBObject = {};
					App.Each.In(Source , ((Index , Item) => {
						IDBObject[Index] = (App.Verify.Confirm(Index , Table.Path) ? Item : App.Cypher.Aes.Decode(Item , Index , Index));
						return true;
					}));
					return IDBObject;
				}
			}
			return new Promise((Resolve , Reject) => {
				Option.IDBOpen = Option.IDBIndexed.open(Option.IDBDatabase , Option.IDBVersion);
				Option.IDBOpen.onupgradeneeded = Event => {
					Option.IDBConnect = Event.target.result;
					App.Each.In(Option.IDBStore , (Index , Item) => {
						if(App.Verify.Empty(Option.IDBConnect.objectStoreNames.contains(Index))){
							const IDBCreate = Option.IDBConnect.createObjectStore(Index , {
								keyPath : Item.Path ,
								autoIncrement : Item.Auto ,
							});
							App.Each.Of(Item.Index , IItem => {
								IDBCreate.createIndex((App.Verify.Array(IItem.Key) ? String.Join(IItem.Key , '.') : IItem.Key) , IItem.Key , {
									unique : IItem.Unique ,
									multiEntry : IItem.Multi ,
								});
							});
						}
					});
				}
				Option.IDBOpen.onsuccess = Event => {
					Option.IDBConnect = Event.target.result;
					Resolve(new class {
						Table(Data){
							Data = App.String.Concat(Option.IDBPrefix , '_' , Data);
							if(App.Verify.Empty(Option.IDBAffair)) Option.IDBTransaction = Option.IDBConnect.transaction(Data , 'readwrite');
							Option.IDBCurrent = Option.IDBTransaction.objectStore(Data);
							return new class {
								Select(Value , Cursor){
									if(App.Verify.Undefined(Cursor)) Cursor = Option.IDBStore[Data].Path;
									return new Promise(Callable => {
										Option.IDBCallable.Each(Value , (Item , Symbol) => {
											if(Symbol) return (Option.IDBCypher ? Option.IDBCallable.Decode(Option.IDBStore[Data] , Item) : Item);
											if(App.Verify.Empty(Value)) return Option.IDBCurrent.openCursor();
											if(App.Verify.Require(Cursor , 'array')){
												if(Option.IDBCypher) App.Each.In(Value , (Index , Item) => {
													Value[Index] = App.Cypher.Aes.Encode(Item , Cursor[Index] , Cursor[Index]);
												});
												return Option.IDBCurrent.index(Array.Join(Cursor , '.')).openCursor(Option.IDBKeyRange.only(Item) , 'next');
											}
											if(App.Verify.Require(Cursor , 'string') && !App.Verify.Confirm(Cursor , Option.IDBStore[Data].Path)) return Option.IDBCurrent.index(Cursor).openCursor(Option.IDBKeyRange.only((Option.IDBCypher ? Cypher.Aes.Encode(Item , Cursor , Cursor) : Item)) , 'next');
											return Option.IDBCurrent.get(App.Number.Convert(Item));
										} , 1 , Callable , Cursor);
									});
								}
								Save(Value){
									return new Promise(Callable => {
										Option.IDBCallable.Each(Value , (Item , Symbol) => {
											return Option.IDBCurrent.put((Option.IDBCypher ? Option.IDBCallable.Encode(Option.IDBStore[Data] , Item) : Item));
										} , 2 , Callable , '');
									});
								}
								Delete(Value){
									return new Promise(Callable => {
										Option.IDBCallable.Each(Value , (Item , Symbol) => {
											return Option.IDBCurrent.delete(Item);
										} , 3 , Callable , '');
									});
								}
							}
						}
						async Affair(Callable){
							Option.IDBAffair = true;
							Option.IDBTransaction = Option.IDBConnect.transaction(Object.Key(Option.IDBStore) , 'readwrite');
							const Symbol = await Callable();
							Option.IDBAffair = false;
							return Symbol;
						}
					});
				}
				Option.IDBOpen.onerror = Exception => {
					return Reject(Exception);
				}
			});
		}
		Cookie = {
			Check : Afferent => {
				let Symbol = false;
				App.Each.Of(App.String.Split(document.cookie , ';') , Data => {
					if(!Symbol && App.Verify.In(App.String.Trim(Data) , App.String.Concat(Key , '='))) Symbol = true;
					if(Symbol) return false;
					return true;
				});
				return Symbol;
			} ,
			Length : () => {
				return App.Util.Length(App.String.Split(document.cookie , ';'));
			} ,
			All : Afferent => {
				if(!App.Verify.Boolean(Afferent)) Afferent = false;
				const Data = {};
				App.Each.Of(App.String.Split(document.cookie , ';') , Item => {
					let [Key , Value] = App.String.Split(App.String.Trim(Item) , '=');
					if(Afferent) Value = App.Cypher.Des.Decode(Value , Key);
					try{
						Data[Key] = App.String.Json(Value);
					}catch(E){
						Data[Key] = (App.Verify.Numeral(Value) ? App.Number.Convert(Value) : (App.Verify.In(['true' , 'false'] , App.String.Lower(Value)) ? (App.Verify.Confirm('true' , App.String.Lower(Value)) ? true : false) : Value));
					}
					return true;
				});
				return Data;
			} ,
			Read : (...Afferent) => {
				const [Key , Default , Cypher] = Afferent;
				if(!this.Cookie.Check(Key)) return Default;
				const Data = this.Cookie.All(Cypher);
				return Data[Key];
			} ,
			Write : (...Afferent) => {
				let [Key , Value , Expire , Cypher] = Afferent;
				if(!App.Verify.Number(Expire)) Expire = 1;
				if(!App.Verify.Boolean(Cypher)) Cypher = false;
				const Time = App.String.Pad.End(App.Calculate.Add(App.Date.Time() , Expire) , 0 , 13);
				Value = App.Object.Json(Value);
				if(Cypher) Value = App.Cypher.Des.Encode(Value , Key);
				document.cookie = App.String.Concat(Key , '=' , Value , ';expires=' , App.Date.Get(Time).toGMTString());
				return true;
			} ,
			Delete : Afferent => {
				return this.Cookie.Write(Key , '' , -1);
			} ,
		}
		Session = {
			Check : Afferent => {
				let Symbol = false;
				App.Each.Loop.Add(0 , this.Session.Length() , 1 , Index => {
					const Key = sessionStorage.key(Index);
					if(!Symbol && App.Verify.Confirm(Key , Afferent)) Symbol = true;
					if(Symbol) return false;
					return true;
				});
				return Symbol;
			} ,
			Length : () => {
				return App.Util.Length(sessionStorage);
			} ,
			All : Afferent => {
				const Data = {};
				App.Each.Loop.Add(0 , this.Session.Length() , 1 , Index => {
					const Key = sessionStorage.key(Index);
					Data[Key] = this.Session.Read(Key , '' , Afferent);
					return true;
				});
			} ,
			Read : (...Afferent) => {
				let [Key , Default , Cypher] = Afferent;
				if(!this.Session.Check(Key)) return Default;
				if(!App.Verify.Boolean(Cypher)) Cypher = false;
				let Value = sessionStorage.getItem(Key);
				if(Cypher) Value = App.Cypher.Des.Decode(Value , Key);
				try{
					return App.String.Json(Value);
				}catch(E){
					if(App.Verify.Numeral(Value)) return App.Number.Convert(Value);
					if(App.Verify.In(['true' , 'false'] , App.String.Lower(Value))){
						if(App.Verify.Confirm('true' , App.String.Lower(Value))) return true;
						return false;
					}
					return Value;
				}
			} ,
			Write : (...Afferent) => {
				let [Key , Value , Cypher] = Afferent;
				if(!App.Verify.Boolean(Cypher)) Cypher = false;
				Value = App.Object.Json(Value);
				if(Cypher) Value = App.Cypher.Des.Encode(Value , Key);
				return sessionStorage.setItem(Key , Value);
			} ,
			Delete : Afferent => {
				return sessionStorage.removeItem(Afferent);
			} ,
		}
		Local = {
			Check : Afferent => {
				let Symbol = false;
				App.Each.Loop.Add(0 , this.Local.Length() , 1 , Index => {
					const Key = localStorage.key(Index);
					if(!Symbol && App.Verify.Confirm(Key , Afferent)) Symbol = true;
					if(Symbol) return false;
					return true;
				});
				return Symbol;
			} ,
			Length : () => {
				return App.Util.Length(localStorage);
			} ,
			All : Afferent => {
				const Data = {};
				App.Each.Loop.Add(0 , this.Local.Length() , 1 , Index => {
					const Key = localStorage.key(Index);
					Data[Key] = this.Local.Read(Key , '' , Afferent);
					return true;
				});
			} ,
			Read : (...Afferent) => {
				let [Key , Default , Cypher] = Afferent;
				if(!this.Local.Check(Key)) return Default;
				if(!App.Verify.Boolean(Cypher)) Cypher = false;
				let Value = localStorage.getItem(Key);
				if(Cypher) Value = App.Cypher.Des.Decode(Value , Key);
				try{
					return App.String.Json(Value);
				}catch(E){
					if(App.Verify.Numeral(Value)) return App.Number.Convert(Value);
					if(App.Verify.In(['true' , 'false'] , App.String.Lower(Value))){
						if(App.Verify.Confirm('true' , App.String.Lower(Value))) return true;
						return false;
					}
					return Value;
				}
			} ,
			Write : (...Afferent) => {
				let [Key , Value , Cypher] = Afferent;
				if(!App.Verify.Boolean(Cypher)) Cypher = false;
				Value = App.Object.Json(Value);
				if(Cypher) Value = App.Cypher.Des.Encode(Value , Key);
				return localStorage.setItem(Key , Value);
			} ,
			Delete : Afferent => {
				return localStorage.removeItem(Afferent);
			} ,
		}
	}
}