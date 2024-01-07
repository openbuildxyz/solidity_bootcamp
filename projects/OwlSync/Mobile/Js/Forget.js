export default App => {
	return new class {
		constructor(){
			this.Template().Event();
		}
		Template(){
			App.Target.Section.append(`<div id="Forget" class="Frame layui-anim layui-anim-scale"></div>`);
			App.Target.Section.find('> #Forget').append(App.String.Concat(`
				<div class="Glass layui-anim layui-anim-up">
					<input type="text" placeholder="` , App.Language.L_8 , `" autocomplete="off" name="Username" />
					<input type="password" placeholder="` , App.Language.L_10 , `" autocomplete="off" name="Password" />
					<input type="password" placeholder="` , App.Language.L_2 , ` ` , App.Language.L_10 , `" name="Confirm" />
					<input type="text" placeholder="` , App.Language.L_9 , `" name="Email" />
					<input type="text" placeholder="` , App.Language.L_11 , `" maxlength="6" name="Code" />
					<span data-count="60" class="layui-hide">` , App.Language.L_12 , `</span>
					<div class="Button">` , App.Language.L_38 , `</div>
					<div class="Jump">
						` , App.Language.L_39 , `
						<span>` , App.Language.L_4 , `</span>
					</div>
				</div>
			`));
			this.Target = {};
			this.Target.Glass = App.Target.Section.find('> #Forget > .Glass');
			return this;
		}
		Event(){
			App.Event.Form.Input(this.Target.Glass.find('> input[name="Email"]') , Self => {
				const Value = Self.val();
				if(App.Verify.Email(Value)){
					this.Target.Glass.find('> span').removeClass('layui-hide');
				}else{
					this.Target.Glass.find('> span').addClass('layui-hide');
				}
			});
			App.Function.Bind(this.Target.Glass.find('> span') , Self => {
				if(Self.hasClass('layui-hide') || Self.hasClass('Countdown')) return false;
				if(!App.Verify.Email(this.Target.Glass.find('> input[name="Email"]').val())) return App.Layer.Error(App.Language.L_13);
				App.Function.Request.Post(App.Language.L_14 , 'Owl.Send' , {
					Method : 3 ,
					Account : this.Target.Glass.find('> input[name="Username"]').val() ,
					Email : this.Target.Glass.find('> input[name="Email"]').val() ,
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
				return App.Function.Forward('Login' , 'Forget');
			});
			App.Function.Bind(this.Target.Glass.find('> .Button') , Self => {
				App.Function.Request.Post(App.Language.L_45 , 'Owl.Forget' , {
					Account : this.Target.Glass.find('> input[name="Username"]').val() ,
					Password : this.Target.Glass.find('> input[name="Password"]').val() ,
					Confirm : this.Target.Glass.find('> input[name="Confirm"]').val() ,
					Email : this.Target.Glass.find('> input[name="Email"]').val() ,
					Code : this.Target.Glass.find('> input[name="Code"]').val() ,
				} , Request => {
					if(App.Verify.Eq(Request.Error , 1)) return App.Layer.Error(App.Language.L_27);
					if(App.Verify.Eq(Request.Error , 2)) return App.Layer.Error(App.Language.L_28);
					if(App.Verify.Eq(Request.Error , 3)) return App.Layer.Error(App.Language.L_41);
					if(App.Verify.Eq(Request.Error , 4)) return App.Layer.Error(App.Language.L_23);
					if(App.Verify.Eq(Request.Error , 5)) return App.Layer.Error(App.Language.L_33);
					if(App.Verify.Eq(Request.Error , 6)) return App.Layer.Error(App.Language.L_42);
					return App.Layer.Success(App.Language.L_43 , () => {
						App.Function.Forward('Login' , 'Forget');
					});
				});
			});
		}
	}
}