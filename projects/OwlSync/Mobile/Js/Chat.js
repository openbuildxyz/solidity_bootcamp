export default App => {
	return new class {
		constructor(){
			this.Template().Event();
		}
		Template(){
			App.Target.Section.append(App.String.Concat(`
				<div id="Chat" class="Frame">
					<div class="Head layui-anim layui-anim-down">
						<i class="layui-icon layui-icon-app"></i>
						<span>OwlSync</span>
						<i class="layui-icon"></i>
					</div>
					<ul class="Wicket"></ul>
					<div class="Foot">
						<textarea placeholder="` , App.Language.L_52 , ` ..."></textarea>
						<i class="layui-icon layui-icon-release"></i>
						<div class="Quote layui-hide">
							<div class="Content"></div>
							<i class="layui-icon layui-icon-close"></i>
						</div>
					</div>
				</div>
			`));
			this.Target = {};
			this.Target.Chat = App.Target.Section.find('> #Chat');
			this.Target.Wicket = this.Target.Chat.find('> .Wicket');
			this.Target.Foot = this.Target.Chat.find('> .Foot');
			return this;
		}
		Event(){
			App.Function.Request.Post(App.Language.L_72 , 'Owl.Dialogue' , {
				Guid : App.Storage.Local.Read('Guid') ,
			} , Request => {
				const Template = [];
				App.Each.Of(Request , Item => {
					if(!App.Verify.Eq(Item.Layout , 5)) return true;
					let Summarize;
					try{
						Summarize = App.String.Json(Item.Summarize);
					}catch{
						Summarize = Item.Summarize;
					}
					App.Array.Push(Template , App.String.Concat(`
						<li class="User layui-anim layui-anim-fadein">
							<div class="Panel"><div class="Text">` , Item.Question , `</div></div>
							` , (App.Verify.Object(Summarize) && !App.Verify.Empty(Summarize.Quote) ? App.String.Concat(`<div class="Quote">` , Summarize.Quote , `</div>`) : ``) , `
						</li>
						<li data-uuid="` , Item.Uuid , `" class="Bot layui-anim layui-anim-fadein">
							<div class="Panel">
								<div class="Text">` , (App.Verify.Object(Summarize) ? Summarize.Answer : Summarize) , `</div>
								` , (App.Verify.Object(Summarize) && !App.Verify.Empty(Summarize.Question) ? App.String.Concat(`
								<ul class="Recommend">` , (() => {
									const Question = [];
									App.Each.Of(Summarize.Question , Value => {
										App.Array.Push(Question , App.String.Concat(`<li>` , Value , `</li>`));
										return true;
									});
									return App.Array.Join(Question , ``);
								})() , `</ul>
								`) : ``) , `
								<div class="Tool">
									<i class="layui-icon layui-icon-praise"></i>
									<i class="layui-icon layui-icon-share"></i>
									<i class="layui-icon layui-icon-more-vertical"></i>
								</div>
							</div>
						</li>
					`));
					return true;
				});
				this.Target.Wicket.append(App.Array.Join(Template , ``));
				this.Scroll();
				this.Recommend(this.Target.Wicket.find('> li > .Panel > .Recommend > li'));
				this.Tool(this.Target.Wicket.find('> li > .Panel > .Tool > i'));
				this.Quote(this.Target.Wicket.find('> li.User > .Quote'));
			});
			App.Event.Keyboard.Quick(this.Target.Foot.find('> textarea') , Self => {
				this.Target.Foot.find('> .layui-icon-release').trigger('click');
			} , {
				Ctrl : true ,
				Code : 10 ,
			});
			App.Function.Bind(this.Target.Foot.find('> .layui-icon-release') , Self => {
				if(Self.hasClass('layui-hide')) return false;
				const Question = this.Target.Foot.find('> textarea').val();
				const Quote = this.Target.Foot.find('> .Quote > .Content').text();
				if(App.Verify.Empty(Question)) return false;
				Self.addClass('layui-hide');
				this.Target.Foot.find('> textarea').val('');
				App.Function.Request.Post('' , 'Owl.Chat' , {
					Guid : App.Storage.Local.Read('Guid') ,
					Question : App.Cypher.Url.Encode(App.Cypher.Base64.Encode(Question)) ,
					Quote : App.Cypher.Url.Encode(App.Cypher.Base64.Encode(Quote)) ,
				} , Request => {
					this.Target.Foot.find('> .Quote').addClass('layui-hide').find('> .Content').empty();
					if(App.Verify.Empty(Request)) return App.Layer.Error(App.Language.L_73 , () => {
						this.Restore();
					});
					this.Target.Wicket.append(App.String.Concat(`
						<li class="User layui-anim layui-anim-fadein">
							<div class="Panel"><div class="Text">` , Request.Question , `</div></div>
							` , (App.Verify.Empty(Quote) ? `` : App.String.Concat(`<div class="Quote">` , Quote , `</div>`)) , `
						</li>
					`));
					this.Scroll();
					return App.Request.Stream({
						Link : '/Owl/Search' ,
						Query : {
							Guid : App.Storage.Local.Read('Guid') ,
							Uuid : Request.Uuid ,
						} ,
						Receive : (Data , Stream) => {
							if(App.Verify.Eq(Data.Status , 1)){
								this.Target.Wicket.append(App.String.Concat(`
									<li data-uuid="` , Request.Uuid , `" class="Bot layui-anim layui-anim-fadein">
										<div class="Panel">
											<div class="Text"></div>
										</div>
									</li>
								`));
								this.Scroll();
							}else if(App.Verify.Eq(Data.Status , 2)){
								this.Target.Wicket.find(App.String.Concat('> li[data-uuid="' , Request.Uuid , '"] > .Panel > .Text')).append(Data.Answer);
								this.Scroll();
							}else{
								if(App.Verify.Eq(Data.Status , 3)){
									this.Target.Wicket.find(App.String.Concat('> li[data-uuid="' , Request.Uuid , '"] > .Panel')).append(App.String.Concat(`
										<ul class="Recommend">
											` , (() => {
												const Template = [];
												App.Each.Of(Data.Question , Value => {
													App.Array.Push(Template , App.String.Concat(`<li>` , Value , `</li>`));
													return true;
												});
												return App.Array.Join(Template , ``);
											})() , `
										</ul>
									`));
									this.Recommend(this.Target.Wicket.find(App.String.Concat('> li[data-uuid="' , Request.Uuid , '"] > .Panel > .Recommend > li')));
								}
								this.Target.Wicket.find(App.String.Concat('> li[data-uuid="' , Request.Uuid , '"] > .Panel')).append(`
									<div class="Tool">
										<i class="layui-icon layui-icon-praise"></i>
										<i class="layui-icon layui-icon-share"></i>
										<i class="layui-icon layui-icon-more-vertical"></i>
									</div>
								`);
								this.Tool(this.Target.Wicket.find(App.String.Concat('> li[data-uuid="' , Request.Uuid , '"] > .Panel > .Tool > i')));
								this.Quote(this.Target.Wicket.find(App.String.Concat('> li[data-uuid="' , Request.Uuid , '"]')).prev('li.User').find('> .Quote'));
								Stream.close();
								this.Restore();
							}
						} ,
						Error(Event , Stream){
							Stream.close();
							this.Restore();
						} ,
					});
				});
			});
			this.Initialize();
			App.Function.Menu();
		}
		Initialize(){
			if(App.Verify.Require(App.Const.Question , 'string')) this.Target.Foot.find('> textarea').val(App.Const.Question);
			if(App.Verify.Require(App.Const.Quote , 'string')) this.Target.Foot.find('> .Quote').removeClass('layui-hide').find('> .Content').text(App.Const.Quote);
			App.Function.Bind(this.Target.Foot.find('> .Quote > i.layui-icon-close') , Self => {
				Self.parent().addClass('layui-hide').find('> .Content').empty();
			});
			App.Const.Quote = '';
			App.Const.Question = '';
			this.Quote(this.Target.Foot.find('> .Quote > .Content'));
		}
		Restore(){
			this.Target.Foot.find('> .layui-icon-release').removeClass('layui-hide');
			this.Scroll();
		}
		Scroll(){
			this.Target.Wicket.animate({
				scrollTop : this.Target.Wicket[0].scrollHeight ,
			} , 0);
		}
		Recommend(Target){
			App.Function.Bind(Target , Self => {
				this.Target.Foot.find('> textarea').val(Self.text());
				this.Target.Foot.find('> .layui-icon-release').trigger('click');
			});
		}
		Tool(Target){
			App.Function.Bind(Target , Self => {
				
			});
		}
		Quote(Target){
			App.Function.Bind(Target , Self => {
				return App.Layer.Open({
					id : 'Quote' ,
					type : 1 ,
					area : ['100%' , '360px'] ,
					anim : 'slideUp' ,
					offset : 'b' ,
					closeBtn : 0 ,
					content : Self.text() ,
				});
			});
		}
	}
}