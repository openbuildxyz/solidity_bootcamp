export default App => {
	return new class {
		constructor(){
			if(!App.Verify.Empty(App.Storage.Local.Read('Guid' , ''))) return App.Function.Forward('Home' , 'Login');
			this.Template().Event();
		}
		Template(){
			App.Target.Section.append(`<div id="Login" class="Frame layui-anim layui-anim-scale"></div>`);
			App.Target.Section.find('> #Login').append(App.String.Concat(`
				<div class="Glass layui-anim layui-anim-up">
					<input type="text" placeholder="` , App.Language.L_8 , ` / ` , App.Language.L_9 , `" autocomplete="off" name="Account" />
					<input type="password" placeholder="` , App.Language.L_10 , `" autocomplete="off" name="Password" />
					<input type="text" placeholder="` , App.Language.L_11 , `" maxlength="6" name="Code" class="layui-hide" />
					<span data-count="60" class="layui-hide">` , App.Language.L_12 , `</span>
					<div class="Button">` , App.Language.L_4 , `</div>
					<div class="Wallet">` , App.Language.L_5 , `</div>
					<div class="Jump">
						` , App.Language.L_6 , `
						<span>` , App.Language.L_7 , `</span>
					</div>
				</div>
			`));
			this.Target = {};
			this.Target.Glass = App.Target.Section.find('> #Login > .Glass');
			return this;
		}
		Event(){
			App.Event.Form.Input(this.Target.Glass.find('> input[name="Account"]') , Self => {
				const Value = Self.val();
				if(App.Verify.Email(Value)){
					this.Target.Glass.find('> input[name="Code"]').val('').removeClass('layui-hide');
					this.Target.Glass.find('> input[name="Password"]').val('').addClass('layui-hide');
					this.Target.Glass.find('> span').removeClass('layui-hide');
				}else{
					this.Target.Glass.find('> input[name="Code"]').val('').addClass('layui-hide');
					this.Target.Glass.find('> input[name="Password"]').val('').removeClass('layui-hide');
					this.Target.Glass.find('> span').addClass('layui-hide');
				}
			});
			App.Function.Bind(this.Target.Glass.find('> span') , Self => {
				if(Self.hasClass('layui-hide') || Self.hasClass('Countdown')) return false;
				if(!App.Verify.Email(this.Target.Glass.find('> input[name="Account"]').val())) return App.Layer.Error(App.Language.L_13);
				App.Function.Request.Post(App.Language.L_14 , 'Owl.Send' , {
					Method : 1 ,
					Email : this.Target.Glass.find('> input[name="Account"]').val() ,
				} , Request => {
					if(App.Verify.Eq(Request.Error , 4)) return App.Layer.Error(App.Language.L_15);
					if(App.Verify.Eq(Request.Error , 3)) return App.Layer.Confirm(App.Language.L_16 , () => {
						App.Function.Forward('Login');
					} , {
						title : App.Language.L_1 ,
						btn : [App.Language.L_2 , App.Language.L_3] ,
					});
					if(App.Verify.Eq(Request.Error , 2)) return App.Layer.Confirm(App.Language.L_17 , () => {
						App.Function.Forward('Register');
					} , {
						title : App.Language.L_1 ,
						btn : [App.Language.L_2 , App.Language.L_3] ,
					});
					if(App.Verify.Eq(Request.Error , 1)) return App.Layer.Error(App.Language.L_18);
					return App.Layer.Success(App.Language.L_19 , () => {
						let Interval = App.Util.Interval(() => {
							const Count = App.Calculate.Sub(App.Number.Convert(Self.attr('data-count')) , 1);
							if(App.Verify.Eq(Count , 0)){
								Self.removeClass('Countdown').text(App.Language.L_20).attr('data-count' , 60);
								clearInterval(Interval);
							}else{
								Self.addClass('Countdown').text(App.String.Concat(Count , ' ' , App.Language.L_21)).attr('data-count' , Count);
							}
						} , 1 , true);
					});
				});
			});
			App.Function.Bind(this.Target.Glass.find('> .Jump > span') , Self => {
				return App.Function.Forward('Register' , 'Login');
			});
			App.Function.Bind(this.Target.Glass.find('> .Button') , Self => {
				App.Function.Request.Post(App.Language.L_22 , 'Owl.Login' , {
					Account : this.Target.Glass.find('> input[name="Account"]').val() ,
					Password : this.Target.Glass.find('> input[name="Password"]').val() ,
					Code : this.Target.Glass.find('> input[name="Code"]').val() ,
				} , Request => {
					if(App.Verify.Eq(Request.Error , 4)) return App.Layer.Error(App.Language.L_23);
					if(App.Verify.Eq(Request.Error , 3)) return App.Layer.Confirm(App.Language.L_24 , () => {
						return App.Function.Forward('Forget' , 'Login');
					} , {
						title : App.Language.L_1 ,
						btn : [App.Language.L_2 , App.Language.L_3] ,
					});
					if(App.Verify.Eq(Request.Error , 2)) return App.Layer.Error(App.Language.L_25);
					if(App.Verify.Eq(Request.Error , 1)) return App.Layer.Error(App.Language.L_26);
					App.Layer.Success(App.Language.L_37 , () => {
						App.Storage.Local.Write('Level' , Request.Level);
						App.Storage.Local.Write('Language' , Request.Language);
						App.Storage.Local.Write('Invite' , Request.Invite);
						App.Storage.Local.Write('Guid' , Request.Guid);
						App.Storage.Local.Write('Nickname' , Request.Nickname);
						App.Storage.Local.Write('Email' , Request.Email);
						window.location.reload();
					});
				});
			});
			App.Function.Bind(this.Target.Glass.find('> .Wallet') , Self => {
				const Link = 'https://wallet.aivvv.cc';
				return App.Layer.Open({
					id : 'WalletLogin' ,
					type : 2 ,
					area : ['100%' , '360px'] ,
					anim : 'slideUp' ,
					offset : 'b' ,
					closeBtn : 0 ,
					content : Link ,
					success(Layer , Index){
						App.$('#WalletLogin').parent().css({
							borderRadius : '40px 40px 0 0' ,
						});
						window.addEventListener('message' , Event => {
							if(App.Verify.Confirm(Link , Event.origin) && App.Verify.String(Event.data) && App.Verify.Eq(App.String.Find(Event.data , '0x') , 0)) App.Layer.Close(Index , () => {
								App.Function.Request.Post(App.Language.L_22 , 'Owl.Register' , {
									Mold : 2 ,
									Guid : App.String.Uniqid() ,
									Address : Event.data ,
									Invite : App.Target.Section.attr('data-invite') ,
								} , Request => {
									if(App.Verify.Eq(Request.Error , 1)) return App.Layer.Error(App.Language.L_27);
									if(App.Verify.Eq(Request.Error , 2)) return App.Layer.Error(App.Language.L_28);
									if(App.Verify.Eq(Request.Error , 3)) return App.Layer.Error(App.Language.L_29);
									if(App.Verify.Eq(Request.Error , 4)) return App.Layer.Error(App.Language.L_30);
									if(App.Verify.Eq(Request.Error , 5)) return App.Layer.Error(App.Language.L_31);
									if(App.Verify.Eq(Request.Error , 6)) return App.Layer.Error(App.Language.L_32);
									if(App.Verify.Eq(Request.Error , 7)) return App.Layer.Error(App.Language.L_33);
									if(App.Verify.Eq(Request.Error , 8)) return App.Layer.Error(App.Language.L_34);
									if(App.Verify.Eq(Request.Error , 9)) return App.Layer.Error(App.Language.L_35);
									return App.Layer.Success(App.Language.L_37 , () => {
										App.Storage.Local.Write('Level' , Request.Level);
										App.Storage.Local.Write('Language' , Request.Language);
										App.Storage.Local.Write('Invite' , Request.Invite);
										App.Storage.Local.Write('Guid' , Request.Guid);
										App.Storage.Local.Write('Address' , Request.Address);
										return App.Function.Forward('Home' , 'Login');
									});
								});
							});
						} , false);
					} ,
				});
			});
		}
	}
}