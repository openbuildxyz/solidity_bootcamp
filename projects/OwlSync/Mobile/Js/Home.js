export default App => {
	return new class {
		constructor(){
			if(App.Verify.Empty(App.Storage.Local.Read('Guid' , ''))) return App.Function.Forward('Login');
			this.Template().Event();
		}
		Template(){
			App.Target.Section.append(App.String.Concat(`
				<div id="Home" class="Frame">
					<div class="Wicket">
						<div class="Search">
							<i class="layui-icon layui-icon-search"></i>
							<input type="text" placeholder="` , App.Language.L_46 , ` ..." />
						</div>
					</div>
					<ul class="Foot">
						<li data-forward="Chat">
							<i class="layui-icon layui-icon-survey"></i>
							<span>` , App.Language.L_49 , `</span>
						</li>
						<li data-forward="Account">
							<i class="layui-icon layui-icon-user"></i>
							<span>` , App.Language.L_51 , `</span>
						</li>
					</ul>
				</div>
			`));
			this.Target = {};
			this.Target.Home = App.Target.Section.find('> #Home');
			this.Target.Wicket = this.Target.Home.find('> .Wicket');
			return this;
		}
		Event(){
			App.Event.Form.Focus(this.Target.Wicket.find('> .Search > input') , Self => {
				return App.Layer.Open({
					id : 'Search' ,
					type : 1 ,
					area : ['100%' , '100%'] ,
					closeBtn : 0 ,
					anim : 5 ,
					content : App.String.Concat(`
						<div class="Label layui-form">
							<input type="text" lay-affix="clear" lay-filter="clear" placeholder="` , App.Language.L_52 , ` ..." class="layui-input">
							<button type="button" class="layui-btn">` , App.Language.L_3 , `</button>
						</div>
						<ul class="History layui-hide"></ul>
						<div class="Panel">
							<ul class="Project layui-hide"></ul>
							<ul class="Chat layui-hide"></ul>
						</div>
					`) ,
					success(Layer , Index){
						layui.form.render();
						const Option = {};
						Option.Input = Layer.find('> #Search > .Label input');
						Option.History = App.String.Json(App.Storage.Local.Read('History' , '[]'));
						Option.Boolean = false;
						Option.Storage = false;
						Option.Time = App.Date.Microtime();
						Option.Callable = () => {
							const Template = [];
							App.Each.Of(App.Array.Reverse(Option.History) , Item => {
								App.Array.Push(Template , App.String.Concat(`<li><span>` , Item , `</span></li>`));
								if(App.Verify.Length(Template , 10)) return false;
								return true;
							});
							Layer.find('> #Search > .History').addClass('layui-hide').empty();
							if(!App.Verify.Empty(Template)){
								Layer.find('> #Search > .History').removeClass('layui-hide').append(App.Array.Join(Template , ``));
								App.Function.Bind(Layer.find('> #Search > .History > li > span') , Self => {
									Option.Input.val(Self.text()).parent().find('> .layui-input-affix').removeClass('layui-hide');
									Option.Boolean = true;
									Option.Time = App.Date.Microtime();
								});
							}
						}
						Option.Input.focus();
						App.Event.Form.Input(Option.Input , Self => {
							Option.Boolean = true;
							Option.Storage = true;
							Option.Time = App.Date.Microtime();
						});
						if(!App.Verify.Empty(Option.History)) Option.Callable();
						Option.Interval = App.Util.Interval(() => {
							if(!App.Verify.Empty(Option.Input.val())){
								if(Option.Boolean && App.Verify.Gt(App.Calculate.Sub(App.Date.Microtime() , Option.Time) , 100)){
									Option.Boolean = false;
									App.Function.Request.Post('' , 'Owl.NewSearch' , {
										Guid : App.Storage.Local.Read('Guid') ,
										Keyword : Option.Input.val() ,
									} , Request => {
										const Template = [];
										App.Each.In(Request , (Item , Value) => {
											App.Array.Push(Template , App.String.Concat(`
												<li data-id="` , Item , `"` , (App.Verify.Min(Template , 5) ? ` class="layui-hide"` : ``) , `>
													` , App.String.Replace(App.String.Lower(Value) , Option.Input.val() , App.String.Concat(`<span>` , Option.Input.val() , `</span>`)) , `
												</li>
											`));
											return true;
										});
										if(App.Verify.Min(Template , 5)) App.Array.Push(Template , App.String.Concat(`
											<div class="More">
												<span>` , App.Language.L_53 , `</span>
											</div>
										`));
										Layer.find('> #Search > .Panel > .Chat').empty().addClass('layui-hide');
										if(!App.Verify.Empty(Template)) Layer.find('> #Search > .Panel > .Chat').removeClass('layui-hide').append(App.Array.Join(Template , ``));
									});
								}
								if(Option.Storage && App.Verify.Gt(App.Calculate.Sub(App.Date.Microtime() , Option.Time) , 3000)){
									App.Array.Push(Option.History , Option.Input.val());
									Option.Storage = false;
									App.Storage.Local.Write('History' , App.Object.Json(Option.History));
									Option.Callable();
								}
							}
						} , 0.05);
						App.Function.Bind(Layer.find('> #Search > .Label > button') , Self => {
							clearInterval(Option.Interval);
							Layer.addClass('layui-hide');
							App.Layer.Close(Index);
						});
						layui.form.on('input-affix(clear)' , Affix => {
							Option.Boolean = false;
							Layer.find('> #Search > .Panel > .Project').empty().addClass('layui-hide');
							Layer.find('> #Search > .Panel > .Chat').empty().addClass('layui-hide');
						});
					} ,
				});
			});
			App.Function.Bind(App.Target.Section.find('> #Home > .Foot > li') , Self => {
				return App.Function.Forward(Self.attr('data-forward') , 'Home');
			});
		}
	}
}