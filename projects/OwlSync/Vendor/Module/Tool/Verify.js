'use strict';
export default App => {
	return new class {
		String(Afferent){
			return this.Type(Afferent , 'string');
		}
		Number(Afferent){
			return this.Type(Afferent , 'number');
		}
		Array(Afferent){
			return this.Type(Afferent , 'array');
		}
		Object(Afferent){
			return this.Type(Afferent , 'object');
		}
		Function(Afferent){
			return this.Type(Afferent , 'function');
		}
		Boolean(Afferent){
			return this.Type(Afferent , 'boolean');
		}
		Undefined(Afferent){
			return this.Type(Afferent , 'undefined');
		}
		Type(...Afferent){
			const [Data , Method] = Afferent;
			if(this.Confirm(typeof Method , 'object')){
				if(this.In(Method , 'array') && window.Array.isArray(Data)) return true;
				if(this.In(Method , typeof Data)) return true;
				return false;
			}
			if(this.Confirm(Method , 'array') && window.Array.isArray(Data)) return true;
			if(this.Confirm(Method , typeof Data)) return true;
			return false;
		}
		Null(Afferent){
			if(this.Confirm(Afferent , null)) return true;
			return false;
		}
		Nan(Afferent){
			if(isNaN(Afferent)) return true;
			return false;
		}
		Empty(Afferent){
			if(this.Function(Afferent)) return false;
			if(this.Number(Afferent)) return false;
			if(this.Undefined(Afferent)) return true;
			if(this.Boolean(Afferent) && Afferent) return false;
			if(this.Null(Afferent)) return true;
			if(this.Object(Afferent) && this.Min(Afferent , 1)) return false;
			if(this.String(Afferent) && !this.Confirm(Afferent , '')) return false;
			return true;
		}
		Confirm(...Afferent){
			const [Data , Refer] = Afferent;
			return window.Object.is(Data , Refer);
		}
		In(...Afferent){
			let [Data , Refer] = Afferent;
			if(this.Empty(Refer)) return false;
			if(this.Object(Data) && !this.Array(Data)) Data = App.Object.Value(Data);
			if(!this.Array(Data)) Data = App.String.Convert(Data);
			if(this.Object(Refer)){
				let Symbol = true;
				App.Each.Of(Refer , Value => {
					if(Symbol && !Data.includes(Value)) Symbol = false;
					return Symbol;
				});
				return Symbol;
			}
			return Data.includes(Refer);
		}
		Require(...Afferent){
			const [Data , Method] = Afferent;
			const Check = this.Type(Method , ['string' , 'array' , 'object' , 'number' , 'function' , 'boolean']);
			if((Check && !this.Type(Data , Method)) || (!Check && this.Type(Data , Method))) return false;
			if(this.Empty(Data)) return false;
			return true;
		}
		With(...Afferent){
			const [Data , Appoint] = Afferent;
			if(this.Require(Data , 'undefined') && this.Require(Appoint , 'undefined')) return true;
			return false;
		}
		Without(...Afferent){
			const [Data , Appoint] = Afferent;
			if(!this.Require(Data , 'undefined') && this.Require(Appoint , 'undefined')) return true;
			return false;
		}
		Same(...Afferent){
			const [Data , Value , Appoint] = Afferent;
			if(this.Confirm(Data , Value) && this.Require(Appoint , 'undefined')) return true;
			return false;
		}
		Range(...Afferent){
			const [Data , Min , Max] = Afferent;
			return this.Between(App.Util.Length(Data) , Min , Max);
		}
		Length(...Afferent){
			const [Data , Size] = Afferent;
			return this.Eq(App.Util.Length(Data) , Size);
		}
		Min(...Afferent){
			const [Data , Size] = Afferent;
			return this.Egt(App.Util.Length(Data) , Size);
		}
		Max(...Afferent){
			const [Data , Size] = Afferent;
			return this.Elt(App.Util.Length(Data) , Size);
		}
		Eq(...Afferent){
			const [Data , Size] = Afferent;
			if(App.Number.Convert(Data) === App.Number.Convert(Size)) return true;
			return false;
		}
		Gt(...Afferent){
			const [Data , Size] = Afferent;
			if(App.Number.Convert(Data) > App.Number.Convert(Size)) return true;
			return false;
		}
		Lt(...Afferent){
			const [Data , Size] = Afferent;
			if(App.Number.Convert(Data) < App.Number.Convert(Size)) return true;
			return false;
		}
		Egt(...Afferent){
			const [Data , Size] = Afferent;
			if(App.Number.Convert(Data) >= App.Number.Convert(Size)) return true;
			return false;
		}
		Elt(...Afferent){
			const [Data , Size] = Afferent;
			if(App.Number.Convert(Data) <= App.Number.Convert(Size)) return true;
			return false;
		}
		Between(...Afferent){
			const [Data , Min , Max] = Afferent;
			if(this.Egt(Data , Min) && this.Elt(Data , Max)) return true;
			return false;
		}
		Match(...Afferent){
			const [Data , RegExp] = Afferent;
			if(this.Array(RegExp)){
				let Symbol = true;
				App.Each.Of(RegExp , Rule => {
					if(Symbol && this.Empty(Rule.test(Data))) Symbol = false;
					return Symbol;
				});
				return Symbol;
			}
			return RegExp.test(Data);
		}
		Email(Afferent){
			return this.Match(Afferent , /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/);
		}
		Url(Afferent){
			return this.Match(Afferent , /^((https|http|ftp|rtsp|mms|ws|wss)?:\/\/)[^\s]+/);
		}
		Phone(Afferent){
			return this.Match(Afferent , /^(([0-9]{3,4})-)?([0-9]{7,8})(-([0-9]{3}))?$/);
		}
		Mobile(Afferent){
			return this.Match(Afferent , /^(13[0-9]|14[57]|15[012356789]|17[678]|18[0-9]|19[0-9])[0-9]{8}$/);
		}
		Alpha(Afferent){
			return this.Match(Afferent , /^([a-zA-Z])+$/);
		}
		Numeral(Afferent){
			if(this.Integer(Afferent) || this.Decimal(Afferent)) return true;
			return false;
		}
		Integer(Afferent){
			return this.Match(Afferent , /^(-)?[0-9]+$/);
		}
		Decimal(Afferent){
			return this.Match(Afferent , /^(\-)?[0-9]+\.[0-9]+$/);
		}
		Chs(Afferent){
			return this.Match(Afferent , /^[\u4e00-\u9fa5]+$/);
		}
		AlphaNumber(Afferent){
			return this.Match(Afferent , /^[a-zA-Z0-9]+$/);
		}
		AlphaChs(Afferent){
			return this.Match(Afferent , /^[a-zA-Z\u4e00-\u9fa5]+$/);
		}
		AlphaNumberChs(Afferent){
			return this.Match(Afferent , /^[a-zA-Z0-9\u4e00-\u9fa5]+$/);
		}
		AlphaDesh(Afferent){
			return this.Match(Afferent , /^([a-zA-Z-_])+$/);
		}
		AlphaNumberDesh(Afferent){
			return this.Match(Afferent , /^[a-zA-Z0-9-_]+$/);
		}
		AlphaChsDesh(Afferent){
			return this.Match(Afferent , /^[a-zA-Z\u4e00-\u9fa5-_]+$/);
		}
		AlphaNumberChsDesh(Afferent){
			return this.Match(Afferent , /^[a-zA-Z0-9\u4e00-\u9fa5-_]+$/);
		}
		Ip(Afferent){
			if(this.Ipv4(Afferent) || this.Ipv6(Afferent)) return true;
			return false;
		}
		Ipv4(Afferent){
			return this.Match(Afferent , /^([0-9]|[1-9]\d{1}|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d{1}|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d{1}|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d{1}|1\d\d|2[0-4]\d|25[0-5])$/);
		}
		Ipv6(Afferent){
			return this.Match(Afferent , /((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))[%\.\+/]?/);
		}
		Date(Afferent){
			if(this.String(Afferent)){
				if(this.Nan(window.Date.parse(Afferent))) return false;
				return true;
			}
			if(this.Nan((new window.Date((this.Object(Afferent) ? Afferent : (this.Integer(Afferent) ? App.Number.Convert(App.String.Pad.End(Afferent , 0 , 13)) : Afferent)))))) return false;
			return true;
		}
		Expire(...Afferent){
			const [Data , Min , Max] = Afferent;
			if(!this.Date(Data) || !this.Date(Min) || !this.Date(Max)) return false;
			return this.Between(App.Date.Time(Data) , App.Date.Time(Min) , App.Date.Time(Max));
		}
		Before(...Afferent){
			const [Data , Before] = Afferent;
			if(!this.Date(Data) || !this.Date(Before)) return false;
			return this.Elt(App.Date.Time(Data) , App.Date.Time(Before));
		}
		After(...Afferent){
			const [Data , After] = Afferent;
			if(!this.Date(Data) || !this.Date(After)) return false;
			return this.Egt(App.Date.Time(Data) , App.Date.Time(After));
		}
		Leap(Afferent){
			if(!this.Date(Afferent)) return false;
			return this.Eq(App.Number.Cop(App.Date.Year(Afferent) , 4) , 0);
		}
		License(...Afferent){
			const [Data , Include] = Afferent;
			if(!this.Match(Data , /^[京津冀晋蒙辽吉黑沪苏浙皖闽赣鲁豫鄂湘粤桂琼川贵云渝藏陕甘青宁新]{1}[a-zA-Z]{1}[0-9a-zA-Z]{5}$/)) return false;
			if(!this.Require(Include , 'string')) return true;
			return this.In(Data , Include);
		}
		Card(Afferent){
			if(!this.Match(Afferent , /^([0-9]{6})(19|20)?([0-9]{9})([0-9]{1}|X)?$/)) return false;
			const Option = {};
			Option.City = {
				11 : '北京' , 12 : '天津' , 13 : '河北' , 14 : '山西' , 15 : '内蒙古' ,
				21 : '辽宁' , 22 : '吉林' , 23 : '黑龙江' ,
				31 : '上海' , 32 : '江苏' , 33 : '浙江' , 34 : '安徽' , 35 : '福建' , 36 : '江西' , 37 : '山东' ,
				41 : '河南' , 42 : '湖北' , 43 : '湖南' , 44 : '广东' , 45 : '广西' ,  46 : '海南' ,
				50 : '重庆' , 51 : '四川' , 52 : '贵州' , 53 : '云南' , 54 : '西藏' ,
				61 : '陕西' , 62 : '甘肃' , 63 : '青海' , 64 : '宁夏' ,  65 : '新疆' ,
				71 : '台湾' ,
				81 : '香港' , 82 : '澳门' ,
				91 : '国外' ,
			};
			Option.Factor = [7 , 9 , 10 , 5 , 8 , 4 , 2 , 1 , 6 , 3 , 7 , 9 , 10 , 5 , 8 , 4 , 2];
			Option.Parity = [1 , 0 , 'X' , 9 , 8 , 7, 6 , 5 , 4 , 3 , 2];
			Option.Sum = 0;
			Option.Array = String.Split(Afferent , '');
			if(!this.String(Option.City[App.String.Substr(Afferent , 0 , 2)])) return false;
			if(!this.Length(Afferent , 18)) return false;
			App.Each.In(Option.Array , (Index , Value) => {
				if(this.Eq(Index , 17)) return false;
				Option.Sum = App.Calculate.Add(Option.Sum , App.Calculate.Mul(Value , Option.Factor[Index]));
				return true;
			});
			Option.Final = Option.Parity[App.Number.Cop(Option.Sum , 11)];
			return this.Confirm(App.String.Convert(Option.Final) , App.String.Convert(Option.Array[17]));
		}
		Wap(){
			let Symbol = false;
			App.Each.Of(['android' , 'ipad' , 'iphone' , 'linux' , 'sysmbianos' , 'mobile' , 'windows phone'] , Option => {
				if(!Symbol && this.In(App.String.Lower(window.navigator.userAgent) , Option)) Symbol = true;
				if(Symbol) return false;
				return true;
			});
			return Symbol;
		}
		Ios(){
			if(!this.Wap()) return false;
			let Symbol = false;
			App.Each.Of(['iphone' , 'ipad' , 'ipod'] , Option => {
				if(!Symbol && this.In(App.String.Lower(window.navigator.userAgent) , Option)) Symbol = true;
				if(Symbol) return false;
				return true;
			});
			return Symbol;
		}
		Android(){
			if(!this.Wap() || this.Ios) return false;
			return true;
		}
		Pad(){
			if(!this.Wap() || !this.Lt(window.screen.width , 1440)) return false;
			return true;
		}
		Wx(){
			return this.In(App.String.Lower(window.navigator.userAgent) , 'micromessenger');
		}
		Ali(){
			return this.In(App.String.Lower(window.navigator.userAgent) , 'alipay');
		}
		Transverse(){
			if(this.Wap() && this.In([90 , -90] , window.orientation)) return true;
			if(this.Gt(window.screen.width , window.screen.height)) return true;
			return false;
		}
		Vertical(){
			if(this.Wap() && this.In([0 , 180] , window.orientation)) return true;
			if(this.Lt(window.screen.width , window.screen.height)) return true;
			return false;
		}
	}
}