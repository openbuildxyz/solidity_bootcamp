'use strict';
export default App => {
	const Storage = {};
	Storage.Css = [];
	Storage.Js = {};
	Storage.Json = {};
	Storage.Html = {};
	const Suffix = {};
	Suffix.Js = 'js';
	Suffix.Css = 'css';
	Suffix.Json = 'json';
	Suffix.Html = 'html';
	return new class {
		Make(...Afferent){
			let [Link , Method , Version] = Afferent;
			let String = '';
			String = App.String.Concat(String , window.location.origin);
			if(!App.Verify.In(App.String.Lower(Link) , 'vendor')){
				String = App.String.Concat(String , '/' , App.String.First(App.Route.Program));
				const Boolean = (App.Verify.String(Method) && App.Verify.In(App.Object.Key(Suffix) , App.String.First(App.String.Lower(Method))));
				if(Boolean) String = App.String.Concat(String , '/' , App.String.First(App.String.Lower(Method)));
			}
			App.Each.Of(App.String.Split(Link , '/') , Item => {
				String = App.String.Concat(String , '/' , App.String.First(App.String.Lower(Item)));
				return true;
			});
			if(Boolean && App.Verify.String(Suffix[App.String.First(App.String.Lower(Method))])) String = App.String.Concat(String , '.' , Suffix[App.String.First(App.String.Lower(Method))]);
			if(!App.Verify.Boolean(Version) && App.Route.Version) Version = true;
			if(Version) String = App.String.Concat(String , '?version=' , App.Date.Microtime());
			return String;
		}
		async Js(...Afferent){
			let [Data , Method , Version] = Afferent;
			if(App.Verify.Object(Data)) Data = App.Object.Value(Data);
			if(App.Verify.String(Data)) Data = [Data];
			if(!App.Verify.Boolean(Method)) Method = true;
			const Option = {};
			if(App.Verify.Array(Data) && App.Verify.Min(Data , 1)){
				for(const Item of Data){
					const Make = (Method ? this.Make(Item , 'Js' , Version) : App.String.Concat(Item , '.' , Suffix.Js));
					if(!App.Verify.In(App.Object.Key(Storage.Js) , Make)) Storage.Js[Make] = await import(Make);
					Option[Item] = Storage.Js[Make];
				}
			}
			return (App.Verify.Length(Option , 1) ? App.Object.Value(Option)[0] : Option);
		}
		async Json(...Afferent){
			let [Data , Method , Version] = Afferent;
			if(App.Verify.Object(Data)) Data = App.Object.Value(Data);
			if(App.Verify.String(Data)) Data = [Data];
			if(!App.Verify.Boolean(Method)) Method = true;
			const Option = {};
			if(App.Verify.Array(Data) && App.Verify.Min(Data , 1)){
				for(const Item of Data){
					const Make = (Method ? this.Make(Item , 'Json' , Version) : App.String.Concat(Item , '.' , Suffix.Json));
					if(!App.Verify.In(App.Object.Key(Storage.Json) , Make)) Storage.Json[Make] = await App.$.getJSON(Make);
					Option[Item] = Storage.Json[Make];
				}
			}
			return (App.Verify.Length(Option , 1) ? App.Object.Value(Option)[0] : Option);
		}
		async Html(...Afferent){
			let [Data , Method , Version] = Afferent;
			if(App.Verify.Object(Data)) Data = App.Object.Value(Data);
			if(App.Verify.String(Data)) Data = [Data];
			if(!App.Verify.Boolean(Method)) Method = true;
			const Option = {};
			if(App.Verify.Array(Data) && App.Verify.Min(Data , 1)){
				for(const Item of Data){
					const Make = (Method ? this.Make(Item , 'Html' , Version) : App.String.Concat(Item , '.' , Suffix.Html));
					if(!App.Verify.In(App.Object.Key(Storage.Html) , Make)) Storage.Html[Make] = await App.$.get(Make);
					Option[Item] = Storage.Html[Make];
				}
			}
			return (App.Verify.Length(Option , 1) ? App.Object.Value(Option)[0] : Option);
		}
		Css(...Afferent){
			let [Data , Method , Version] = Afferent;
			if(App.Verify.Object(Data)) Data = App.Object.Value(Data);
			if(App.Verify.String(Data)) Data = [Data];
			if(!App.Verify.Boolean(Method)) Method = true;
			let Loading = 0;
			if(App.Verify.Array(Data) && App.Verify.Min(Data , 1)) App.Each.Of(Data , Item => {
				const Make = (Method ? this.Make(Item , 'Css' , Version) : App.String.Concat(Item , '.' , Suffix.Css));
				if(App.Verify.In(Storage.Css , Make)){
					Loading = App.Calculate.Add(Loading , 1);
					return true;
				}
				const NodeElement = document.createElement('link');
				NodeElement.rel = 'stylesheet';
				NodeElement.href = Make;
				document.head.insertBefore(NodeElement , document.head.lastChild);
				if(NodeElement.attachEvent){
					NodeElement.attachEvent('onload' , () => {
						Loading = App.Calculate.Add(Loading , 1);
						App.Array.Push(Storage.Css , NodeElement.href);
					});
				}else{
					let Loaded = false;
					const LoadedInterval = App.Util.Interval(() => {
						if(Loaded){
							clearInterval(LoadedInterval);
							Loading = App.Calculate.Add(Loading , 1);
							App.Array.Push(Storage.Css , NodeElement.href);
						}
						if(App.Verify.Match(App.String.Lower(window.navigator.userAgent) , /webkit/i)){
							if(NodeElement.sheet) Loaded = true;
						}else if(NodeElement.sheet){
							try{
								if(NodeElement.sheet.cssRules) Loaded = true;
							}catch(E){
								if(Verify.Eq(E.code , 1000)) Loaded = true;
							}
						}
					} , 0.01);
				}
			});
			return new Promise(Resolve => {
				let Max = 1000;
				const LoadingInterval = App.Util.Interval(() => {
					Max = App.Calculate.Sub(Max , 1);
					if(App.Verify.Eq(Max , 0) || App.Verify.Length(Data , Loading)){
						clearInterval(LoadingInterval);
						Resolve();
					}
				} , 0.01);
			});
		}
	}
}