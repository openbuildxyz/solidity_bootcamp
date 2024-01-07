export default App => {
	return new class {
		constructor(){
			this.Template().Event();
		}
		Template(){
			App.Target.Section.append(App.String.Concat(`
				<div id="Account" class="Frame">
					<div class="Head layui-anim layui-anim-down">
						<i class="layui-icon layui-icon-app"></i>
						<span>OwlSync</span>
						<i class="layui-icon layui-icon-set"></i>
					</div>
					<div class="Wicket">
						<div class="Information">
							<img src="/Mobile/Image/user.png" />
							<div class="Nickname"></div>
						</div>
						<ul class="Toolbar">
							<li data-forward="Invite">
								<i class="layui-icon layui-icon-at"></i>
								<span>` , App.Language.L_54 , `</span>
							</li>
							<li data-forward="Integral">
								<i class="layui-icon layui-icon-diamond"></i>
								<span>` , App.Language.L_55 , `</span>
							</li>
							<li data-forward="Language">
								<i class="layui-icon layui-icon-website"></i>
								<span>` , App.Language.L_56 , `</span>
							</li>
						</ul>
					</div>
				</div>
			`));
			this.Target = {};
			this.Target.Account = App.Target.Section.find('> #Account');
			this.Target.Wicket = this.Target.Account.find('> .Wicket');
			return this;
		}
		Event(){
			this.Target.Wicket.find('> .Information > .Nickname').text((App.Storage.Local.Check('Address') ? App.Storage.Local.Read('Address') : App.Storage.Local.Read('Email')));
			App.Function.Menu();
			App.Function.Bind(App.Target.Section.find('> #Account > .Head > i.layui-icon-set') , Self => {
				return App.Layer.Open({
					type : 1 ,
					title : false ,
					area : ['50vw' , '100%'] ,
					anim : 'slideLeft' ,
					shadeClose : true ,
					offset : 'r' ,
					closeBtn : 0 ,
					content : App.String.Concat(`
						<ul id="Config">
							<li data-forward="Password">
								<i class="layui-icon layui-icon-password"></i>
								<span>` , App.Language.L_57 , `</span>
							</li>
							<li data-forward="Exit">
								<i class="layui-icon layui-icon-logout"></i>
								<span>` , App.Language.L_58 , `</span>
							</li>
						</ul>
					`) ,
					success(Layer , Index){
						App.Function.Bind(Layer.find('> .layui-layer-content > #Config > li') , Self => {
							App.Layer.Close(Index , () => {
								if(App.Verify.Confirm(Self.attr('data-forward') , 'Password')){
									return App.Layer.Open({
										type : 1 ,
										title : App.Language.L_57 ,
										area : '80vw' ,
										shadeClose : true ,
										content : App.String.Concat(`
											<div id="Modify" class="layui-form layui-form-pane">
												<div class="layui-form-item">
													<label class="layui-form-label">` , App.Language.L_59 , `</label>
													<div class="layui-input-block">
														<input type="password" name="Origin" placeholder="` , App.Language.L_52 , ` ..." autocomplete="off" class="layui-input" />
													</div>
												</div>
												<div class="layui-form-item">
													<label class="layui-form-label">` , App.Language.L_60 , `</label>
													<div class="layui-input-block">
														<input type="password" name="Password" placeholder="` , App.Language.L_52 , ` ..." autocomplete="off" class="layui-input" />
													</div>
												</div>
												<div class="layui-form-item">
													<label class="layui-form-label">` , App.Language.L_2 , `</label>
													<div class="layui-input-block">
														<input type="password" name="Confirm" placeholder="` , App.Language.L_52 , ` ..." autocomplete="off" class="layui-input" />
													</div>
												</div>
												<button type="button" class="layui-btn layui-btn-fluid layui-bg-purple">` , App.Language.L_61  , `</button>
											</div>
										`) ,
										success(MLayer , MIndex){
											App.Function.Bind(MLayer.find('> .layui-layer-content > #Modify > button') , Self => {
												const Modify = MLayer.find('> .layui-layer-content > #Modify');
												if(App.Verify.Empty(Modify.find('input[name="Origin"]').val())) return App.Layer.Error(App.Language.L_62);
												if(App.Verify.Empty(Modify.find('input[name="Password"]').val())) return App.Layer.Error(App.Language.L_63);
												if(App.Verify.Empty(Modify.find('input[name="Confirm"]').val())) return App.Layer.Error(App.Language.L_64);
												App.Function.Request.Post(App.Language.L_65 , 'Owl.Modify' , {
													Guid : App.Storage.Local.Read('Guid') ,
													Old : Modify.find('input[name="Origin"]').val() ,
													Password : Modify.find('input[name="Password"]').val() ,
													Confirm : Modify.find('input[name="Confirm"]').val() ,
												} , Request => {
													if(App.Verify.Eq(Request.Error , 1)) return App.Layer.Error(App.Language.L_27);
													if(App.Verify.Eq(Request.Error , 2)) return App.Layer.Error(App.Language.L_33);
													if(App.Verify.Eq(Request.Error , 3)) return App.Layer.Error(App.Language.L_71);
													if(App.Verify.Eq(Request.Error , 4)) return App.Layer.Error(App.Language.L_66);
													if(App.Verify.Eq(Request.Error , 5)) return App.Layer.Error(App.Language.L_67);
													if(App.Verify.Eq(Request.Error , 6)) return App.Layer.Error(App.Language.L_68);
													App.Layer.Close(MIndex , () => {
														App.Layer.Success(App.Language.L_69);
													});
												});
											});
										} ,
									});
								}else if(App.Verify.Confirm(Self.attr('data-forward') , 'Exit')){
									App.Layer.Confirm(App.Language.L_70 , () => {
										App.Storage.Local.Delete('Level');
										App.Storage.Local.Delete('Invite');
										App.Storage.Local.Delete('Guid');
										App.Storage.Local.Delete('Nickname');
										App.Storage.Local.Delete('Email');
										App.Storage.Local.Delete('Address');
										App.Function.Forward('Login' , 'Account');
									} , {
										title : App.Language.L_1 ,
										btn : [App.Language.L_2 , App.Language.L_3] ,
									});
								}
							});
						});
					} ,
				});
			});
			App.Function.Bind(App.Target.Section.find('> #Account > .Wicket > .Toolbar > li') , Self => {
				if(App.Verify.Confirm(Self.attr('data-forward') , 'Language')) App.Route.History = 'Account';
				return App.Function.Forward(App.String.Concat('Detail/' , Self.attr('data-forward')) , 'Account');
			});
		}
	}
}