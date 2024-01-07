export default App => {
	return new class {
		constructor(){
			this.Template().Event();
		}
		Template(){
			App.Target.Section.append(`
				<div id="Language" class="Frame">
					<div class="Head layui-anim layui-anim-down">
						<i class="layui-icon layui-icon-left"></i>
						<span>OwlSync</span>
						<i class="layui-icon"></i>
					</div>
					<div class="Wicket"></div>
				</div>
			`);
			this.Target = {};
			this.Target.Language = App.Target.Section.find('> #Language');
			this.Target.Wicket = this.Target.Language.find('> .Wicket');
			return this;
		}
		Event(){
			App.Function.Request.Get(App.Language.L_72 , App.String.Concat('Owl.Language?Language=' , App.Storage.Local.Read('Language')) , Request => {
				const Template = [];
				App.Each.In(Request , (Letter , Item) => {
					App.Array.Push(Template , App.String.Concat(`
						<div class="Letter">` , App.String.Upper(Letter) , `</div>
						<ul class="Lang">` , (() => {
							const Array = [];
							App.Each.Of(Item , Value => {
								App.Array.Push(Array , App.String.Concat(`<li` , (App.Verify.Confirm(Value.Code , App.Storage.Local.Read('Language')) ? ` class="Hover"` : ``) , ` data-code="` , Value.Code , `">` , Value.Lang , `</li>`));
								return true;
							});
							return App.Array.Join(Array , ``);
						})() , `</ul>
					`));
					return true;
				});
				this.Target.Wicket.append(App.Array.Join(Template , ``));
				App.Function.Bind(this.Target.Wicket.find('> .Lang > li') , Self => {
					if(Self.hasClass('Hover')) return false;
					App.Function.Request.Post(App.Language.L_78 , 'Owl.Language' , {
						Guid : App.Storage.Local.Read('Guid') ,
						Code : Self.attr('data-code') ,
					} , Setting => {
						if(App.Verify.Eq(Setting.Error , 2)) return App.Layer.Error(App.Language.L_79);
						if(App.Verify.Eq(Setting.Error , 1)) return App.Layer.Error(App.Language.L_80);
						return App.Layer.Success(App.Language.L_81 , async () => {
							App.Storage.Local.Write('Language' , Self.attr('data-code'));
							App.Language = await App.Import.Json(Self.attr('data-code'));
							this.Target.Language.find('> .Head > i.layui-icon-left').trigger('click');
						});
					});
				});
			});
			App.Function.Back((App.Verify.String(App.Route.History) ? App.Route.History : 'Account'));
		}
	}
}