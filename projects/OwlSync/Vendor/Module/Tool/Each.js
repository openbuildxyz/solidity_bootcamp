'use strict';
export default App => {
	const Call = new class {
		Symbol(Callable , ...Afferent){
			if(!App.Verify.Function(Callable)) Callable = () => {};
			return Callable(...Afferent);
		}
	}
	return new class {
		Of(...Afferent){
			const [Data , Callable] = Afferent;
			for(const Value of Data){
				const Symbol = Call.Symbol(Callable , Value);
				if(App.Verify.Boolean(Symbol) && !Symbol) break;
			}
		}
		In(...Afferent){
			const [Data , Callable] = Afferent;
			for(const Index in Data){
				const Symbol = Call.Symbol(Callable , Index , Data[Index]);
				if(App.Verify.Boolean(Symbol) && !Symbol) break;
			}
		}
		Loop = {
			Add : (...Afferent) => {
				const [Start , End , Step , Callable] = Afferent;
				for(let Index = Start; Index < End; Index = App.Calculate.Add(Index , Step)){
					const Symbol = Call.Symbol(Callable , Index);
					if(App.Verify.Boolean(Symbol) && !Symbol) break;
					if(App.Verify.Number(Symbol)) Index = Symbol;
				}
			} ,
			Sub : (...Afferent) => {
				const [Start , End , Step , Callable] = Afferent;
				for(let Index = Start; Index > End; Index = App.Calculate.Sub(Index , Step)){
					const Symbol = Call.Symbol(Callable , Index);
					if(App.Verify.Boolean(Symbol) && !Symbol) break;
					if(App.Verify.Number(Symbol)) Index = Symbol;
				}
			} ,
			Mul : (...Afferent) => {
				const [Start , End , Step , Callable] = Afferent;
				for(let Index = Start; Index < End; Index = App.Calculate.Mul(Index , Step)){
					const Symbol = Call.Symbol(Callable , Index);
					if(App.Verify.Boolean(Symbol) && !Symbol) break;
					if(App.Verify.Number(Symbol)) Index = Symbol;
				}
			} ,
			Div : (...Afferent) => {
				const [Start , End , Step , Callable] = Afferent;
				for(let Index = Start; Index > End; Index = App.Calculate.Div(Index , Step)){
					const Symbol = Call.Symbol(Callable , Index);
					if(App.Verify.Boolean(Symbol) && !Symbol) break;
					if(App.Verify.Number(Symbol)) Index = Symbol;
				}
			} ,
		}
	}
}