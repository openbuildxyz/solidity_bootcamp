'use strict';
export default App => {
	return new class {
		Convert(...Afferent){
			let [Data , Digit] = Afferent;
			if(App.Verify.Number(Digit) && App.Verify.Integer(Digit)) return Afferent.toString(Digit);
			return window.String(Afferent);
		}
		Lower(Afferent){
			return this.Convert(Afferent).toLowerCase();
		}
		Upper(Afferent){
			return this.Convert(Afferent).toUpperCase();
		}
		First(Afferent){
			Afferent = this.Convert(Afferent);
			return this.Concat(this.Upper(this.Substr(Afferent , 0 , 1)) , this.Substr(Afferent , 1 , App.Util.Length(Afferent)));
		}
		Trim(Afferent){
			return this.Convert(Afferent).trim();
		}
		Find(...Afferent){
			const [Target , Data] = Afferent;
			return Target.indexOf(this.Convert(Data));
		}
		Count(...Afferent){
			const [Data , Symbol] = Afferent;
			return App.Calculate.Sub(App.Util.Length(App.String.Split(Data , Symbol)) , 1);
		}
		Split(...Afferent){
			let [Data , Symbol] = Afferent;
			if(!App.Verify.String(Symbol)) Symbol = '';
			return this.Convert(Data).split(Symbol);
		}
		Json(Afferent){
			return JSON.parse(this.Convert(Afferent));
		}
		Url(...Afferent){
			let [Data , Encryption] = Afferent;
			if(!App.Verify.Boolean(Encryption)) Encryption = false;
			const Option = {};
			App.Each.Of(this.Split(this.Convert(Data) , '&') , Item => {
				let [Key , Value] = this.Split(Item , '=');
				if(Encryption) Value = App.Cypher.Url.Decode(Value);
				if(App.Verify.Numeral(Value)) Value = App.Number.Convert(Value);
				Option[Key] = Value;
				return true;
			});
			return Option;
		}
		Concat(...Afferent){
			const [Data , ...Additional] = Afferent;
			return this.Convert(Data).concat(...Additional);
		}
		Uniqid(Afferent){
			if(!App.Verify.Boolean(Afferent)) Afferent = true;
			const Uniqid = App.Cypher.Md5(this.Concat(this.Convert(App.Date.Microtime() , 36) , App.Cypher.Md5(this.Random(5)) , this.Convert(App.Number.Random() , 36) , App.Cypher.Md5(this.Random(10))));
			if(!Afferent) return Uniqid;
			return this.Concat(this.Substr(Uniqid , 0 , 8) , '-' , this.Substr(Uniqid , 8 , 12) , '-' , this.Substr(Uniqid , 12 , 16) , '-' , this.Substr(Uniqid , 16 , 20) , '-' , this.Substr(Uniqid , 20 , 32))
		}
		Random(...Afferent){
			let [Length , Repeat] = Afferent;
			if(!App.Verify.Number(Length) || !App.Verify.Integer(Length) || App.Verify.Lt(Length , 0)) Length = 5;
			if(!App.Verify.Boolean(Repeat)) Repeat = true;
			const Reserve = this.Split('abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ0123456789');
			const Array = [];
			App.Each.Loop.Add(0 , Length , 1 , Index => {
				const Shuffle = App.Array.Shuffle(Reserve);
				const String = Shuffle[0];
				if(!Repeat && App.Verify.In(Array , String)) return App.Calculate.Sub(Index , 1);
				App.Array.Push(Array , String);
				return true;
			});
			return App.Array.Join(Array , '');
		}
		Replace(...Afferent){
			let [Data , Rule , Value] = Afferent;
			if(App.Verify.Object(Data)){
				App.Each.In(Data , (Index , Item) => {
					Data[Index] = this.Replace(Item , Rule , Value);
					return true;
				});
			}else if(App.Verify.Object(Rule)){
				if(App.Verify.Array(Rule)){
					App.Each.In(Rule , (Index , Item) => {
						Data = this.Convert(Data).replaceAll(Item , (App.Verify.Undefined(Value[Index]) ? Value : Value[Index]));
						return true;
					});
				}else{
					Data = this.Convert(Data).replace(Rule , (App.Verify.String(Value) ? Value : ''));
				}
			}else{
				Data = this.Convert(Data).replaceAll(Rule , (App.Verify.String(Value) ? Value : ''));
			}
			return Data;
		}
		Repeat(...Afferent){
			let [Data , Length] = Afferent;
			if(!App.Verify.Number(Length)) Length = 0;
			return this.Convert(Data).repeat(Length);
		}
		Pad = {
			Start : (...Afferent) => {
				let [Data , Supplement , Length] = Afferent;
				if(App.Verify.Undefined(Supplement)) Supplement = '';
				if(!App.Verify.Number(Length)) Length = App.Util.Length(this.Convert(Data));
				return this.Convert(Data).padStart(Length , Supplement);
			} ,
			End : (...Afferent) => {
				let [Data , Supplement , Length] = Afferent;
				if(App.Verify.Undefined(Supplement)) Supplement = '';
				if(!App.Verify.Number(Length)) Length = App.Util.Length(this.Convert(Data));
				return this.Convert(Data).padEnd(Length , Supplement);
			} ,
		}
		Substr(...Afferent){
			let [Data , Start , End] = Afferent;
			if(!App.Verify.Number(Start) || !App.Verify.Integer(Start)) Start = 0;
			if(!App.Verify.Number(End) || !App.Verify.Integer(End)) End = App.Util.Length(this.Convert(Data));
			return this.Convert(Data).substring(Start , End);
		}
	}
}