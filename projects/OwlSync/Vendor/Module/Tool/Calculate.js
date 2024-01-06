'use strict';
export default App => {
	const Quantity = Data => {
		let Length = 0;
		App.Each.Of(Data , Item => {
			if(App.Verify.Decimal(Item)){
				const [Integer , Decimal] = App.String.Split(Item , '.');
				Length = App.Number.Max(Length , App.Util.Length(Decimal));
			}
			return true;
		});
		return App.Number.Power(10 , Length);
	}
	return new class {
		Add(...Afferent){
			let Totality = null;
			const Power = Quantity(Afferent);
			App.Each.Of(Afferent , Item => {
				const Amass = this.Mul(Item , Power);
				Totality = (App.Verify.Null(Totality) ? Amass : (Totality + Amass));
				return true;
			});
			return this.Div(Totality , Power);
		}
		Sub(...Afferent){
			let Totality = null;
			const Power = Quantity(Afferent);
			App.Each.Of(Afferent , Item => {
				const Amass = this.Mul(Item , Power);
				Totality = (App.Verify.Null(Totality) ? Amass : (Totality - Amass));
				return true;
			});
			return this.Div(Totality , Power);
		}
		Mul(...Afferent){
			let Totality = null;
			const Power = Quantity(Afferent);
			let Length = 1;
			App.Each.Of(Afferent , Item => {
				Length *= Power;
				const Amass = Item * Power;
				Totality = (App.Verify.Null(Totality) ? Amass : (Totality * Amass));
				return true;
			});
			return this.Div(Totality , Length);
		}
		Div(...Afferent){
			let Totality = null;
			App.Each.Of(Afferent , Amass => {
				Totality = (App.Verify.Null(Totality) ? Amass : (Totality / Amass));
				return true;
			});
			return Totality;
		}
	}
}