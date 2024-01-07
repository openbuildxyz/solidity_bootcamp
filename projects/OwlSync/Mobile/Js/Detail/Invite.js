export default App => {
	return new class {
		constructor(){
			this.Template().Event();
		}
		Template(){
			App.Target.Section.append(App.String.Concat(`
				<div id="Invite" class="Frame">
					<div class="Head layui-anim layui-anim-down">
						<i class="layui-icon layui-icon-left"></i>
						<span>OwlSync</span>
						<i class="layui-icon"></i>
					</div>
					<div class="Wicket">
						<ul class="Detail">
							<li></li>
							<li>
								<span>0</span>
								<span>` , App.Language.L_82 , `</span>
							</li>
						</ul>
						<ul class="Record"></ul>
						<div class="Button">
							<span>` , App.Language.L_83 , `</span>
							<span>` , App.Language.L_84 , `</span>
						</div>
					</div>
				</div>
			`));
			this.Target = {};
			this.Target.Invite = App.Target.Section.find('> #Invite');
			this.Target.Wicket = this.Target.Invite.find('> .Wicket');
			return this;
		}
		Event(){
			const Link = App.String.Concat(window.location.origin , '/' , App.Storage.Local.Read('Invite'));
			App.Image.Qrcode(Link , {
				Width : 300 ,
				Height : 300 ,
			}).then(Qrcode => {
				this.Target.Wicket.find('> .Detail > li:nth-child(1)').append(App.String.Concat(`
					<img src="` , Qrcode , `" />
					<div class="Link layui-hide">` , Link , `</div>
				`));
			});
			App.Function.Request.Post(App.Language.L_72 , 'Owl.Invited' , {
				Guid : App.Storage.Local.Read('Guid') ,
			} , Request => {
				if(App.Verify.Empty(Request)) return false;
				const Template = [];
				App.Each.Of(Request , Item => {
					App.Array.Push(Template , App.String.Concat(`
						<li>
							<span>` , Item.Email , `</span>
							<span>` , App.Date.Today(Item.Time) , `</span>
						</li>
					`));
					return true;
				});
				this.Target.Wicket.find('> .Record').append(App.String.Concat(`
					<li>
						<span>` , App.Language.L_85 , `</span>
						<span>` , App.Language.L_86 , `</span>
					</li>
				` , App.Array.Join(Template , ``)));
				this.Target.Wicket.find('> .Detail > li:nth-child(2) > span:nth-child(1)').text(App.Util.Length(Request));
			});
			App.Function.Bind(this.Target.Wicket.find('> .Button > span') , Self => {
				const Index = Self.index();
				if(App.Verify.Eq(Index , 0)){
					if(App.Util.Browser.Copy(this.Target.Wicket.find('> .Detail > li:nth-child(1) > .Link').text())) return App.Layer.Success(App.Language.L_87);
					return App.Layer.Error(App.Language.L_88);
				}else if(App.Verify.Eq(Index , 1)){
					const Element = document.createElement('a');
					Element.href = this.Target.Wicket.find('> .Detail > li:nth-child(1) > img').attr('src');
					Element.download = App.String.Concat(window.location.hostname , '.png');
					Element.setAttribute('type' , 'application/octet-stream');
					document.body.appendChild(Element);
					Element.click();
					document.body.removeChild(Element);
				}
			});
			App.Function.Back('Account');
		}
	}
}