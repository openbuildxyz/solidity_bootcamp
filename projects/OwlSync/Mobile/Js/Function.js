export default App => {
	return new class {
		Back(Target){
			App.Event.Bind(App.Target.Section.find('> .Frame > .Head > i.layui-icon-left') , 'click' , Banner => {
				return App.Function.Forward(Target , App.Target.Section.find('> .Frame').attr('id'));
			});
		}
		Menu(){
			App.Function.Bind(App.Target.Section.find('> .Frame > .Head > i.layui-icon-app') , Self => {
				return App.Layer.Open({
					type : 1 ,
					title : false ,
					area : ['50vw' , '100%'] ,
					anim : 'slideRight' ,
					shadeClose : true ,
					offset : 'l' ,
					closeBtn : 0 ,
					content : App.String.Concat(`
						<ul id="Menu">
							<li data-forward="Home">
								<i class="layui-icon layui-icon-home"></i>
								<span>` , App.Language.L_74 , `</span>
							</li>
							` , (() => {
								const Array = [];
								const Frame = App.Target.Section.find('> .Frame').attr('id');
								if(!App.Verify.Confirm(Frame , 'Chat')) App.Array.Push(Array , `
									<li data-forward="Chat">
										<i class="layui-icon layui-icon-survey"></i>
										<span>` , App.Language.L_49 , `</span>
									</li>
								`);
								if(!App.Verify.Confirm(Frame , 'Account')) App.Array.Push(Array , `
									<li data-forward="Account">
										<i class="layui-icon layui-icon-user"></i>
										<span>` , App.Language.L_51 , `</span>
									</li>
									<li data-forward="Detail/Language">
										<i class="layui-icon layui-icon-website"></i>
										<span>` , App.Language.L_56 , `</span>
									</li>
								`);
								return App.Array.Join(Array , ``);
							})() , `
						</ul>
					`) ,
					success(Layer , Index){
						App.Function.Bind(Layer.find('> .layui-layer-content > #Menu > li') , Self => {
							App.Route.History = App.Target.Section.find('> .Frame').attr('id');
							return App.Layer.Close(Index , () => {
								return App.Function.Forward(Self.attr('data-forward') , App.Route.History);
							});
						});
					} ,
				});
			});
		}
		Bind(Target , Callable){
			App.Event.Bind(Target , 'click' , Self => {
				return Callable(Self);
			});
		}
		Forward(Link , Option){
			App.Layer.Loading(App.Language.L_75 , Index => {
				if(App.Verify.String(Option)) App.Target.Section.find(App.String.Concat('#' , Option)).remove();
				if(App.Verify.Array(Option)) App.Each.Of(Option , Item => {
					App.Target.Section.find(App.String.Concat('#' , Item)).remove();
					return true;
				});
				if(App.Verify.Confirm(App.Array.Join(App.Route.Link , '/') , Link)){
					App.Import.Js(App.Array.Join(App.Route.Link , '/')).then(Module => {
						Module.default(App);
						if(App.Verify.Function(Option)) Option();
						App.Layer.Close(Index);
					});
				}else{
					App.Util.Jump.Hash(App.String.Replace(Link , '/' , '.'));
				}
			});
		}
		Request = new class {
			Load(Message , Callable){
				if(App.Verify.Empty(Message)) return Callable();
				return App.Layer.Loading(Message , Index => {
					Callable(Index);
				});
			}
			Close(Index , Callable){
				if(App.Verify.Number(Index)) return App.Layer.Close(Index , () => {
					Callable();
				});
				return Callable();
			}
			Get(Message , Link , Callable , Error){
				return this.Load(Message , Index => {
					App.Request.Get({
						Url : App.String.Replace(Link , '.' , '/') ,
						Cache : false ,
						Before : (Xhr) => {
							Xhr.setRequestHeader('Owl-Lang' , App.Storage.Local.Read('Language'));
						} ,
					}).then(Request => {
						this.Close(Index , () => {
							if(App.Verify.In(Link , '.')){
								if(App.Verify.Eq(Request.Status , 200)) return Callable(Request.Data);
								if(App.Verify.Eq(Request.Status , 300)) return App.Layer.Error(App.Language.L_76);
								return App.Layer.Error(App.Language.L_77);
							}else{
								if(App.Verify.Eq(Request.code , 200)) return Callable(Request.data);
								if(App.Verify.Function(Error)) return Error();
								App.Layer.Error(Request.message);
							}
						});
					});
				});
			}
			Post(Message , Link , Data , Callable , Error){
				return this.Load(Message , Index => {
					App.Request.Post({
						Url : App.String.Replace(Link , '.' , '/') ,
						Cache : false ,
						Before : (Xhr) => {
							Xhr.setRequestHeader('Owl-Lang' , App.Storage.Local.Read('Language'));
						} ,
						Data : Data ,
					}).then(Request => {
						this.Close(Index , () => {
							if(App.Verify.In(Link , '.')){
								if(App.Verify.Eq(Request.Status , 200)) return Callable(Request.Data);
								if(App.Verify.Eq(Request.Status , 300)) return App.Layer.Error(App.Language.L_76);
								return App.Layer.Error(App.Language.L_77);
							}else{
								if(App.Verify.Eq(Request.code , 200)) return Callable(Request.data);
								if(App.Verify.Function(Error)) return Error();
								App.Layer.Error(Request.message);
							}
						});
					});
				});
			}
		}
	}
}