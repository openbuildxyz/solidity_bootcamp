'use strict';
export default App => {
	return new class {
		Md5(Afferent){
			return App.String.Convert(App.Crypto.MD5(Afferent));
		}
		Sha1(Afferent){
			return App.String.Convert(App.Crypto.SHA1(Afferent));
		}
		Sha256(Afferent){
			return App.String.Convert(App.Crypto.SHA256(Afferent));
		}
		Sha512(Afferent){
			return App.String.Convert(App.Crypto.SHA512(Afferent));
		}
		Url = {
			Encode : Afferent => {
				return encodeURIComponent(Afferent);
			} ,
			Decode : Afferent => {
				return decodeURIComponent(Afferent);
			} ,
		}
		Base64 = {
			Encode : Afferent => {
				return App.String.Convert(App.Crypto.enc.Base64.stringify(App.Crypto.enc.Utf8.parse(Afferent)));
			} ,
			Decode : Afferent => {
				const Decode = App.String.Convert(App.Crypto.enc.Utf8.stringify(App.Crypto.enc.Base64.parse(Afferent)));
				try{
					return App.String.Json(Decode);
				}catch(E){
					if(App.Verify.Numeral(Decode)) return App.Number.Convert(Decode);
					return Decode;
				}
			} ,
		}
		Aes = {
			Encode : (...Afferent) => {
				let [Data , Key , Iv] = Afferent;
				if(!App.Verify.String(Key)) Key = '';
				if(!App.Verify.Length(Key , 16)) Key = App.String.Pad.End(Key , 0 , 16);
				if(!App.Verify.String(Iv)) Iv = '';
				if(!App.Verify.Length(Iv , 16)) Iv = App.String.Pad.End(Key , 0 , 16);
				return this.Base64.Encode(App.String.Convert(App.Crypto.AES.encrypt(App.String.Convert(Data) , App.Crypto.enc.Utf8.parse(Key) , {
					iv : App.Crypto.enc.Utf8.parse(Iv) ,
					mode : App.Crypto.mode.CBC ,
				})));
			} ,
			Decode : (...Afferent) => {
				let [Data , Key , Iv] = Afferent;
				if(!App.Verify.String(Key)) Key = '';
				if(!App.Verify.Length(Key , 16)) Key = App.String.Pad.End(Key , 0 , 16);
				if(!App.Verify.String(Iv)) Iv = '';
				if(!App.Verify.Length(Iv , 16)) Iv = App.String.Pad.End(Key , 0 , 16);
				const Decode = App.String.Convert(App.Crypto.enc.Utf8.stringify(App.Crypto.AES.decrypt(this.Base64.Decode(Data) , App.Crypto.enc.Utf8.parse(Key) , {
					iv : App.Crypto.enc.Utf8.parse(Iv) ,
					mode : App.Crypto.mode.CBC ,
				})));
				try{
					return App.String.Json(Decode);
				}catch(E){
					if(App.Verify.Numeral(Decode)) return App.Number.Convert(Decode);
					return Decode;
				}
			} ,
		}
		Des = {
			Encode : (...Afferent) => {
				let [Data , Key] = Afferent;
				if(!App.Verify.String(Key)) Key = '';
				if(!App.Verify.Length(Key , 16)) Key = App.String.Pad.End(Key , 0 , 16);
				return this.Base64.Encode(App.String.Convert(App.Crypto.DES.encrypt(App.String.Convert(Data) , Key , {
					mode : App.Crypto.mode.ECB ,
					padding : App.Crypto.pad.Pkcs7 ,
				})));
			} ,
			Decode : (...Afferent) => {
				let [Data , Key] = Afferent;
				if(!App.Verify.String(Key)) Key = '';
				if(!App.Verify.Length(Key , 16)) Key = App.String.Pad.End(Key , 0 , 16);
				const Decode = App.String.Convert(App.Crypto.enc.Utf8.stringify(App.Crypto.DES.decrypt(this.Base64.Decode(Data) , Key , {
					mode : App.Crypto.mode.ECB ,
					padding : App.Crypto.pad.Pkcs7 ,
				})));
				try{
					return App.String.Json(Decode);
				}catch(E){
					if(App.Verify.Numeral(Decode)) return App.Number.Convert(Decode);
					return Decode;
				}
			} ,
		}
	}
}