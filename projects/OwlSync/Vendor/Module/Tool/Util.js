'use strict';
export default App => {
	return new class {
		Console(...Afferent){
			console.warn(...Afferent);
		}
		Length(Afferent){
			if(App.Verify.Number(Afferent.length)) return Afferent.length;
			if(App.Verify.Object(Afferent)) return this.Length(App.Object.Key(Afferent));
			return this.Length(App.String.Convert(Afferent));
		}
		Timeout(...Afferent){
			let [Callable , Time , Immediately] = Afferent;
			if(!App.Verify.Function(Callable)) Callable = () => {};
			if(!App.Verify.Number(Time)) Time = 3;
			if(!App.Verify.Boolean(Immediately)) Immediately = false;
			if(Immediately) Callable();
			return setTimeout(Callable , App.Calculate.Mul(Time , 1000));
		}
		Interval(...Afferent){
			let [Callable , Time , Immediately] = Afferent;
			if(!App.Verify.Function(Callable)) Callable = () => {};
			if(!App.Verify.Number(Time)) Time = 3;
			if(!App.Verify.Boolean(Immediately)) Immediately = false;
			if(Immediately) Callable();
			return setInterval(Callable , App.Calculate.Mul(Time , 1000));
		}
		Beautify(...Afferent){
			let [Data , Size , Char , Level] = Afferent;
			if(!App.Verify.String(Data)) Data = App.Object.Json(Data);
			if(!App.Verify.Number(Size)) Size = 0;
			if(!App.Verify.String(Char)) Char = '	';
			if(!App.Verify.Number(Level)) Level = 0;
			return App.Beautify(Data , Size , Char , Level);
		}
		Pinyin(...Afferent){
			let [Data , Symbol , Letter , Space] = Afferent;
			if(!App.Verify.Boolean(Symbol)) Symbol = false;
			if(!App.Verify.Boolean(Letter)) Letter = false;
			if(!App.Verify.Boolean(Space)) Space = true;
			if(!Letter) Data = App.String.Replace(Data , /[a-z]+/ , '');
			const Option = [];
			App.Each.Loop.Add(0 , this.Length(Data) , 1 , Index => {
				const Value = App.String.Substr(Data , Index , App.Calculate.Add(Index , 1));
				if(App.Verify.Match(Value , /[a-zA-Z0-9\- ]/)){
					App.Array.Push(Option , Value);
				}else{
					const Array = [];
					const Char = Value.charAt(0);
					if(App.Verify.In(App.Pinyin.Dict , Char) && App.Verify.Gt(Value.charCodeAt(0) , 200)){
						let Count = 1;
						while(!App.Verify.Confirm(App.Pinyin.Dict.charAt(App.Calculate.Add(App.String.Find(App.Pinyin.Dict , Char) , Count)) , ',')){
							App.Array.Push(Array , App.Pinyin.Dict.charAt(App.Calculate.Add(App.String.Find(App.Pinyin.Dict , Char) , Count)));
							Count = App.Calculate.Add(Count , 1);
						}
					}else if(Symbol){
						App.Array.Push(Array , Char);
					}
					if(Symbol || !App.Verify.Empty(Array)) App.Array.Push(Option , App.String.First(App.Array.Join(Array , '')));
				}
			});
			return App.Array.Join(Option , (Space ? ' ' : ''));
		}
		Escape(Afferent){
			Afferent = App.String.Convert(Afferent);
			Afferent = App.String.Replace(Afferent , /&(?!#?[a-zA-Z0-9]+;)/g , '&amp;');
			Afferent = App.String.Replace(Afferent , /</g , '&lt;');
			Afferent = App.String.Replace(Afferent , />/g , '&gt;');
			Afferent = App.String.Replace(Afferent , /'/g , '&#39;');
			Afferent = App.String.Replace(Afferent , /"/g , '&quot;');
			return Afferent;
		}
		Unescape(Afferent){
			Afferent = App.String.Convert(Afferent);
			Afferent = App.String.Replace(Afferent , /\&quot;/g , '"');
			Afferent = App.String.Replace(Afferent , /\&#39;/g , "'");
			Afferent = App.String.Replace(Afferent , /\&gt;/g , '>');
			Afferent = App.String.Replace(Afferent , /\&lt;/g , '<');
			Afferent = App.String.Replace(Afferent , /\&amp;/g , '&');
			Afferent = App.String.Replace(Afferent , /\&#x27;/g , "'");
			return Afferent;
		}
		Browser = {
			Home : () => {
				try{
					App.$(window).style.behavior = 'url(#default#homepage)';
					App.$(window).setHomePage(window.location.origin);
					return true;
				}catch(E){
					if(window.netscape){
						try{
							window.netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
							const Component = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
							Component.setCharPref('browser.startup.homepage' , window.location.origin);
							return true;
						}catch(E){
							return false;
						}
					}
					return false;
				}
			} ,
			Copy : Afferent => {
				App.$('body').append(App.String.Concat('<textarea type="text" event="copy" style="position:fixed;top:-10000px;left:-10000px;opacity:0">' , Afferent , '</textarea>'));
				const Target = this.Dom.Get('event="copy"' , 'textarea');
				Target.select();
				const Status = document.execCommand('copy');
				Target.remove();
				return Status;
			} ,
			Collect : Afferent => {
				if(!App.Verify.String(Afferent)) Afferent = window.location.origin;
				try{
					window.external.addFavorite(window.location.origin , Afferent);
					return true;
				}catch(E){
					return false;
				}
			} ,
			Desktop : Afferent => {
				if(!App.Verify.String(Afferent)) Afferent = window.location.origin;
				try{
					const ActiveXObject = new ActiveXObject('WScript.Shell');
					const Link = ActiveXObject.CreateShortcut(App.String.Concat(ActiveXObject.SpecialFolders('Desktop') , '\\' , Afferent , '.url'));
					Link.TargetPath = window.location.origin;
					Link.Save();
					return true;
				}catch(E){
					return false;
				}
			} ,
		}
		Dom = {
			Get : (...Afferent) => {
				let [Attribute , Label] = Afferent;
				if(!App.Verify.Require(Label , 'string')) Label = '*';
				return App.$(App.String.Concat(Label , (App.Verify.Require(Attribute , 'string') ? App.String.Concat('[' , Attribute , ']') : '')));
			} ,
			Set : (...Afferent) => {
				let [Attribute , Label , Option] = Afferent;
				if(!App.Verify.Require(Label , 'string')) Label = '*';
				if(!App.Verify.Object(Option)) Option = {};
				const Target = this.Dom.Get(Attribute , Label);
				App.Each.In(Option , (Key , Value) => {
					Target.attr(Key , Value);
					return true;
				});
				return true;
			} ,
		}
		Jump = {
			Make : (...Afferent) => {
				const [Uri , Search , Hash , Query , Protocol] = Afferent;
				let String = '';
				if(App.Verify.Require(Uri , 'string')) String = App.String.Concat(String , Uri);
				if(App.Verify.In(String , '#')) String = App.String.Substr(String , 0 , App.String.Find(String , '#'));
				if(App.Verify.In(String , '?')) String = App.String.Substr(String , 0 , App.String.Find(String , '?'));
				const Length = this.Length(String);
				if(!App.Verify.Empty(Uri) && !App.Verify.Confirm(App.String.Substr(String , App.Calculate.Sub(Length , 1) , Length) , '/')){
					String = App.String.Lower(App.String.Concat(String , '/'));
					if(!App.Verify.Boolean(Protocol)) Protocol = false;
					if(Protocol && !App.Verify.In(String , 'http://') && !App.Verify.In(String , 'https://')) String = App.String.Concat(window.location.protocol , '//' , String);
				}
				if(App.Verify.Require(Search , 'object')) String = App.String.Concat(String , '?' , App.Object.Url(Search));
				if(App.Verify.Require(Hash , 'string')) String = App.String.Concat(String , '#' , Hash);
				if(App.Verify.Require(Query , 'object')) String = App.String.Concat(String , '?' , App.Object.Url(Query));
				return String;
			} ,
			Open : (...Afferent) => {
				const [Uri , Search , Hash , Query] = Afferent;
				window.open(this.Jump.Make(Uri , Search , Hash , Query , true));
			} ,
			Location : (...Afferent) => {
				const [Uri , Search , Hash , Query] = Afferent;
				window.location.href = this.Jump.Make(Uri , Search , Hash , Query , true);
			} ,
			Hash : (...Afferent) => {
				const [Data , Query , Search] = Afferent;
				window.location.hash = this.Jump.Make(null , null , Data , Query , false);
				if(App.Verify.Require(Search , 'object')) window.location.search = this.Jump.Make(null , Search , null , null , false);
			} ,
			Forward : (...Afferent) => {
				let [Link , Query , Search , Callable] = Afferent;
				App.Each.In(App.String.Split(Link , '.') , (Index , Item) => {
					App.Route.Link[Index] = App.String.First(Item);
					return true;
				});
				if(App.Verify.Function(Query)){
					Callable = Query;
					Query = {};
				}
				if(App.Verify.Function(Search)){
					Callable = Search;
					Search = {};
				}
				App.Route.Query = (App.Verify.Object(Query) ? Query : {});
				App.Route.Search = (App.Verify.Object(Search) ? Search : {});
				return App.Import.Js(App.String.Replace(Link , '.' , '/')).then(Module => {
					if(App.Verify.Function(Callable)) return Callable(Module.default(App));
					return Module.default(App);
				});
			} ,
		}
	}
}