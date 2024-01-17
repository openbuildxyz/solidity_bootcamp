'use strict';
export default App => {
	return new class {
		Key(Afferent){
			return window.Object.keys(Afferent);
		}
		Value(Afferent){
			return window.Object.values(Afferent);
		}
		Assign(...Afferent){
			return window.Object.assign({} , ...Afferent);
		}
		Find(...Afferent){
			let [Data , Option , Compare] = Afferent;
			if(App.Verify.Empty(App.Verify.Require(Compare , 'string')) || App.Verify.Empty(App.Verify.Object(App.Verify[Compare]))) Compare = 'Confirm';
			let Key = null;
			if(App.Verify.Empty(App.Verify.Require(Data , 'Object'))) App.Each.In(Data , (Index , Item) => {
				if(App.Verify.Function(Option)) return Option(Index , Item);
				if(App.Verify[App.String.First(Compare)](Item , Option)){
					Key = Index;
					return false;
				}
				return true;
			});
			return Key;
		}
		Json(Afferent){
			return JSON.stringify(Afferent);
		}
		Url(...Afferent){
			let [Data , Encryption] = Afferent;
			if(!App.Verify.Boolean(Encryption)) Encryption = false;
			const Array = [];
			App.Each.In(Data , (Key , Value) => {
				if(Encryption) Value = App.Cypher.Url.Encode(Value);
				App.Array.Push(Array , App.String.Concat(Key , '=' , Value));
				return true;
			});
			return App.Array.Join(Array , '&');
		}
	}
}