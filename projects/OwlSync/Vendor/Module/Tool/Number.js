'use strict';
export default App => {
	return new class {
		Convert(Afferent){
			return window.Number(Afferent);
		}
		Fixed(...Afferent){
			let [Data , Digit] = Afferent;
			if(!App.Verify.Number(Digit) || !App.Verify.Integer(Digit) || App.Verify.Lt(Digit , 0)) Digit = 2;
			return this.Convert(Data).toFixed(Digit);
		}
		Precision(...Afferent){
			let [Data , Digit] = Afferent;
			if(!App.Verify.Number(Digit) || !App.Verify.Integer(Digit) || App.Verify.Lt(Digit , 0)) Digit = 2;
			return this.Convert(Data).toPrecision(Digit);
		}
		Scope(...Afferent){
			let [Min , Max , Option] = Afferent;
			if(!App.Verify.Number(Min)) Min = 0;
			if(!App.Verify.Number(Max)) Max = 1;
			if(!App.Verify.Object(Option)) Option = {};
			if(!App.Verify.Boolean(Option.Decimal)) Option.Decimal = true;
			if(!App.Verify.Number(Option.Digit) || !App.Verify.Integer(Option.Digit) || App.Verify.Lt(Option.Digit , 0)) Option.Digit = 2;
			const Number = App.Calculate.Add(App.Calculate.Mul(this.Random() , App.Calculate.Sub(Max , Min)) , Min);
			if(Option.Decimal) return this.Convert(this.Fixed(Number , Option.Digit));
			return this.Round(Number);
		}
		Range(...Afferent){
			let [Start , End , Step] = Afferent;
			if(!App.Verify.Number(Start)) Start = 1;
			if(!App.Verify.Number(End)) End = 10;
			if(!App.Verify.Number(Step)) Step = 1;
			const Array = [];
			App.Each.Loop.Add(Start , End , Step , Index => {
				App.Array.Push(Array , Index);
				return true;
			});
			return Array;
		}
		Format(...Afferent){
			let [Data , Digit] = Afferent;
			if(!App.Verify.Type(Data , ['string' , 'number'])) return '0.00';
			if(!App.Verify.Number(Digit) || !App.Verify.Integer(Digit) || App.Verify.Lt(Digit , 0)) Digit = 2;
			if(App.Verify.In(App.String.Convert(Data) , ',')) Data = App.String.Replace(Data , ',' , '');
			const Number = this.Abs(Data);
			const Negative = App.Verify.Eq(Number , this.Convert(Data));
			let [Integer , Decimal] = App.String.Split(Number , '.');
			if(App.Verify.Undefined(Decimal)) Decimal = 0;
			if(App.Verify.Gt(Digit , 0)) Decimal = App.String.Pad.End(Decimal , 0 , Digit);
			const Length = App.Util.Length(Integer);
			if(App.Verify.Gt(Length , 3)){
				const Than = this.Cop(Length , 3);
				let String = '';
				App.Each.Of(App.String.Substr(Integer , Than) , Value => {
					if(App.Verify.Min(String , 1) && App.Verify.Eq(this.Cop(App.Util.Length(App.String.Replace(String , ',' , '')) , 3) , 0)) String = App.String.Concat(String , ',');
					String = App.String.Concat(String , Value);
					return true;
				});
				Integer = App.String.Concat((App.Verify.Eq(Than , 0) ? '' : App.String.Concat(App.String.Substr(Integer , 0 , Than) , ',')) , String);
			}
			const Final = App.String.Concat('' , (Negative ? '' : '-') , Integer);
			if(App.Verify.Eq(Digit , 0)) return Final;
			return App.String.Concat(Final , '.' , Decimal);
		}
		Power(...Afferent){
			return Math.pow(...Afferent);
		}
		Square(Afferent){
			return Math.sqrt(Afferent);
		}
		Cop(...Afferent){
			const [Data , Target] = Afferent;
			return (Data % Target);
		}
		Min(...Afferent){
			return Math.min(...Afferent);
		}
		Max(...Afferent){
			return Math.max(...Afferent);
		}
		Round(Afferent){
			return Math.round(Afferent);
		}
		Random(){
			return Math.random();
		}
		Ceil(Afferent){
			return Math.ceil(Afferent);
		}
		Floor(Afferent){
			return Math.floor(Afferent);
		}
		Abs(Afferent){
			return Math.abs(Afferent);
		}
		Sin(Afferent){
			return Math.sin(Afferent);
		}
		Asin(Afferent){
			return Math.asin(Afferent);
		}
		Cos(Afferent){
			return Math.cos(Afferent);
		}
		Acos(Afferent){
			return Math.acos(Afferent);
		}
		Tan(Afferent){
			return Math.tan(Afferent);
		}
		Atan(Afferent){
			return Math.atan(Afferent);
		}
		Atan2(...Afferent){
			return Math.atan2(...Afferent);
		}
		Tanh(Afferent){
			return Math.tanh(Afferent);
		}
		Trunc(Afferent){
			return Math.trunc(Afferent);
		}
		Pi(){
			return Math.PI;
		}
	}
}