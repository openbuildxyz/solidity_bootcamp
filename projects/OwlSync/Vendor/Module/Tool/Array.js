'use strict';
export default App => {
	return new class {
		Join(...Afferent){
			let [Data , Separator] = Afferent;
			if(!App.Verify.Require(Separator , 'string')) Separator = '';
			return Data.join(Separator);
		}
		Find(...Afferent){
			let [Data , Option , Compare] = Afferent;
			if(!App.Verify.Require(Compare , 'string') || !App.Verify.Object(App.Verify[Compare])) Compare = 'Confirm';
			let Key = null;
			if(App.Verify.Require(Data , 'array')) App.Each.In(Data , (Index , Item) => {
				if(App.Verify.Function(Option)) return Option(Index , Item);
				if(App.Verify[App.String.First(Compare)](Item , Option)){
					Key = Index;
					return false;
				}
				return true;
			});
			return Key;
		}
		Concat(...Afferent){
			const [Data , ...Additional] = Afferent;
			return Data.concat(...Additional);
		}
		Reverse(Afferent){
			return Afferent.reverse();
		}
		Slice(...Afferent){
			let [Data , Start , End] = Afferent;
			if(!App.Verify.Number(Start)) Start = 0;
			if(!App.Verify.Number(End)) End = App.Util.Length(Data);
			return Data.slice(Start , End);
		}
		Splice(...Afferent){
			let [Data , Start , Length , ...Additional] = Afferent;
			if(App.Verify.Empty(App.Verify.Number(Start))) Start = 0;
			if(App.Verify.Empty(App.Verify.Number(Length))) Length = 0;
			return Data.splice(Start , Length , ...Additional);
		}
		Shift(Afferent){
			return Afferent.shift();
		}
		Pop(Afferent){
			return Afferent.pop();
		}
		Push(...Afferent){
			const [Data , ...Additional] = Afferent;
			return Data.push(...Additional);
		}
		Unshift(...Afferent){
			const [Data , ...Additional] = Afferent;
			return Data.unshift(...Additional);
		}
		Shuffle(Afferent){
			return this.Sort(Afferent , () => {
				return App.Calculate.Sub(App.Number.Random() , 0.5);
			});
		}
		Sort(...Afferent){
			const [Data , Callable] = Afferent;
			return Data.sort((First , Second) => {
				if(App.Verify.Function(Callable)) return Callable(First , Second);
				if(App.Verify.Gt(First , Second)) return 1;
				if(App.Verify.Lt(First , Second)) return -1;
				return 0;
			});
		}
	}
}