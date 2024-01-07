'use strict';
export default new class {
	constructor(){
		this.Loading().Initialize();
	}
	Loading(){
		const Style = document.createElement('Style');
		Style.type = 'text/css';
		Style.innerHTML = `
			body{
				color:#393d49;
				font-family:-apple-system-font,Microsoft YaHei,Arial,sans-serif;
				font-size:14px;
				line-height:24px;
				font-weight:400;
				background-color:#ffffff;
				cursor:default;
				position:fixed;
				z-index:1;
				top:0;
				right:0;
				left:0;
				bottom:0;
				user-select:none;
				-webkit-user-select:none;
				-moz-user-select:none;
				overflow:hidden;
			}
			body > section{
				position:absolute;
				z-index:1;
				top:0;
				right:0;
				left:0;
				bottom:0;
				display:flex;
				justify-content:center;
				align-items:center;
				overflow:hidden;
			}
			body > section #Loader{
				position:relative;
				font-size:2em;
				background:#fff;
				padding:10px;
				color:#000;
				text-transform:uppercase;
				font-weight:bold;
				letter-spacing:0.5em;
			}
			body > section #Loader span{
				color:#fff;
				mix-blend-mode:difference;
			}
			body > section #Loader:before{
				content:'';
				position:absolute;
				top:0;
				left:0;
				width:80px;
				height:100%;
				background:#000;
				animation:animate 3s linear infinite;
			}
			@keyframes animate{
				0%{
					left:0;
				}
				50%{
					left:calc(100% - 80px);
				}
				100%{
					left:0;
				}
			}
		`;
		document.getElementsByTagName('head').item(0).appendChild(Style);
		const Div = document.createElement('div');
		Div.id = 'Loader';
		Div.innerHTML = `<span>Loading</span>`;
		document.getElementsByTagName('section').item(0).appendChild(Div);
		return this;
	}
	Initialize(){
		this.App = {};
		const Module = {};
		Module.Tool = ['Array' , 'Calculate' , 'Cypher' , 'Date' , 'Each' , 'Event' , 'Image' , 'Import' , 'Layer' , 'Number' , 'Object' , 'Request' , 'Storage' , 'String' , 'Util' , 'Verify'];
		Module.Extend = ['Beautify' , 'Crypto' , 'Jquery' , 'Pinyin' , 'Qrcode'];
		for(const Index in Module) for(const Item of Module[Index]) import('./Module/' + Index + '/' + Item + '.js').then(Default => {
			this.App[(Object.is(Item , 'Jquery') ? '$' : Item)] = Default.default(this.App);
		});
		const Length = (Module.Tool.length + Module.Extend.length);
		let Count = 0;
		const Interval = setInterval(() => {
			if(Count === 1000){
				clearInterval(Interval);
			}else if(Object.keys(this.App).length === Length){
				clearInterval(Interval);
				this.Map().Route().Analysis();
			}
			Count += 1;
		} , 10);
	}
	Map(){
		if('onhashchange' in window && (this.App.Verify.Undefined(document.documentMode) || this.App.Verify.Eq(document.documentMode , 8))){
			this.App.$(window).bind('hashchange' , () => {
				this.Route().Analysis();
			});
		}else{
			let Afferent = window.location.hash;
			this.App.Util.Interval(() => {
				if(!this.App.Verify.Confirm(Afferent , window.location.hash)){
					Afferent = window.location.hash;
					this.Route().Analysis();
				}
			} , 0.1);
		}
		return this;
	}
	Route(){
		this.App.Route = {};
		this.App.Route.State = 0;
		this.App.Route.Query = (this.App.Verify.In(window.location.hash , '?') ? this.App.String.Url(this.App.String.Substr(window.location.hash , this.App.Calculate.Add(this.App.String.Find(window.location.hash , '?') , 1) , this.App.Util.Length(window.location.hash))) : {});
		this.App.Route.Search = (this.App.Verify.In(window.location.search , '?') ? this.App.String.Url(this.App.String.Substr(window.location.search , this.App.Calculate.Add(this.App.String.Find(window.location.search , '?') , 1) , this.App.Util.Length(window.location.search))) : {});
		this.App.Route.Program = (() => {
			const Default = 'Default';
			if(this.App.Verify.Ip(window.location.hostname)) return Default;
			const Afferent = this.App.String.Split(window.location.hostname , '.');
			if(this.App.Verify.Max(Afferent , 2)) return Default;
			const Program = this.App.String.Lower(Afferent[0]);
			if(this.App.Verify.Confirm(Program , 'www')) return Default;
			return this.App.String.First(Program);
		})();
		this.App.Route.Link = (this.App.String.Split(this.App.String.Lower(this.App.Verify.In(window.location.hash , '?') ? this.App.String.Substr(window.location.hash , this.App.Calculate.Add(this.App.String.Find(window.location.hash , '#') , 1) , this.App.String.Find(window.location.hash , '?')) : this.App.String.Replace(window.location.hash , '#' , '')) , '.') || []);
		this.App.Each.In(this.App.Route.Link , (Index , Item) => {
			if(this.App.Verify.Empty(Item)) return true;
			this.App.Route.Link[Index] = this.App.String.First(Item);
			return true;
		});
		if(!this.App.Verify.Eq(this.App.Route.State , window.history.state)){
			if(this.App.Verify.Gt(this.App.Route.State , window.history.state)) this.App.Route.State = this.App.Calculate.Add(this.App.Route.State , 1);
			if(this.App.Verify.Lt(this.App.Route.State , window.history.state)) this.App.Route.State = this.App.Calculate.Sub(this.App.Route.State , 1);
		}
		return this;
	}
	Analysis(){
		this.App.Import.Json('Vendor/App').then(Config => {
			if(this.App.Verify.Require(Config[window.location.hostname] , 'object')){
				this.App.Route.Title = (this.App.Verify.Require(Config[window.location.hostname].Title , 'string') ? Config[window.location.hostname].Title : '');
				this.App.Route.Program = (this.App.Verify.Require(Config[window.location.hostname].Program , 'string') ? Config[window.location.hostname].Program : '');
				this.App.Route.Version = (this.App.Verify.Require(Config[window.location.hostname].Version , 'boolean') ? Config[window.location.hostname].Version : false);
			}
			this.Lunch();
		});
		return this;
	}
	Icon(){
		if(this.App.Verify.Eq(this.App.Util.Length(this.App.$('head > link[rel="icon"]')) , 0)) this.App.$('head').append('<link rel="icon" type="image/png" sizes="32x32" />');
		this.App.$('head > link[rel="icon"]').attr('href' , this.App.String.Concat('/' , 'Ico/' , this.App.String.First(this.App.Route.Program) , '.ico'));
		return this;
	}
	Title(){
		if(this.App.Verify.Eq(this.App.Util.Length(this.App.$('head > title')) , 0)) this.App.$('head').append('<title></title>');
		this.App.$('head > title').text(this.App.Route.Title);
		return this;
	}
	async Lunch(){
		this.Icon().Title();
		if(this.App.Verify.Length(this.App.$('body > section') , 0)) this.App.$('body').append('<section></section>');
		this.App.Target = {};
		this.App.Target.Head = this.App.$('head');
		this.App.Target.Title = this.App.Target.Head.find('> title');
		this.App.Target.Body = this.App.$('body');
		this.App.Target.Section = this.App.Target.Body.find('> section');
		await this.App.Import.Css(['Vendor/Style/App' , 'App']);
		const Module = await this.App.Import.Js('App');
		Module.default(this.App);
	}
}