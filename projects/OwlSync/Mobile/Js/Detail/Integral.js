export default App => {
	return new class {
		constructor(){
			this.Template().Event();
		}
		Template(){
			App.Target.Section.append(App.String.Concat(`
				<div id="Integral" class="Frame">
					<div class="Head layui-anim layui-anim-down">
						<i class="layui-icon layui-icon-left"></i>
						<span>OwlSync</span>
						<i class="layui-icon"></i>
					</div>
					<div class="Wicket">
						<ul class="Detail">
							<li>
								<span>0</span>
								<span>` , App.Language.L_54 , `</span>
							</li>
							<li>
								<span>0</span>
								<span>` , App.Language.L_89 , `</span>
							</li>
							<li>
								<span>0</span>
								<span>` , App.Language.L_90 , `</span>
							</li>
						</ul>
						<ul class="Record"></ul>
					</div>
				</div>
			`));
			this.Target = {};
			this.Target.Integral = App.Target.Section.find('> #Integral');
			this.Target.Wicket = this.Target.Integral.find('> .Wicket');
			return this;
		}
		Event(){
			App.Function.Request.Post(App.Language.L_72 , 'Owl.Integral' , {
				Guid : App.Storage.Local.Read('Guid') ,
			} , Request => {
				if(App.Verify.Empty(Request)) return false;
				const Fraction = {};
				Fraction.Invite = 0;
				Fraction.Daily = 0;
				const Template = [];
				App.Each.Of(Request , Item => {
					App.Array.Push(Template , App.String.Concat(`
						<li>
							<span>` , (() => {
								if(App.Verify.Eq(Item.Type , 1)){
									Fraction.Invite = App.Calculate.Add(Fraction.Invite , Item.Fraction);
									return App.Language.L_54;
								}
								Fraction.Daily = App.Calculate.Add(Fraction.Invite , Item.Fraction);
								if(App.Verify.Eq(Item.Type , 2)) return App.Language.L_49;
								return App.Language.L_91;
							})() , `</span>
							<span>` , Item.Fraction , `</span>
							<span>` , App.Date.Today(Item.Time) , `</span>
						</li>
					`));
					return true;
				});
				this.Target.Wicket.find('> .Record').append(App.String.Concat(`
					<li>
						<span>` , App.Language.L_92 , `</span>
						<span>` , App.Language.L_55 , `</span>
						<span>` , App.Language.L_93 , `</span>
					</li>
				` , App.Array.Join(Template , ``)));
				this.Target.Wicket.find('> .Detail > li:nth-child(1) > span:nth-child(1)').text(Fraction.Invite);
				this.Target.Wicket.find('> .Detail > li:nth-child(2) > span:nth-child(1)').text(Fraction.Daily);
				this.Target.Wicket.find('> .Detail > li:nth-child(3) > span:nth-child(1)').text(App.Calculate.Add(Fraction.Invite , Fraction.Daily));
			});
			App.Function.Back('Account');
		}
	}
}