export default App => {
	return new class {
		constructor(){
			this.Template().Event();
		}
		Template(){
			App.Target.Section.append(`
				<div id="New" class="Frame">
					<div class="Head layui-anim layui-anim-down">
						<i class="layui-icon layui-icon-left"></i>
						<span>OwlSync</span>
						<i class="layui-icon"></i>
					</div>
					<div class="Wicket"></div>
				</div>
			`);
			this.Target = {};
			this.Target.New = App.Target.Section.find('> #New');
			this.Target.Wicket = this.Target.New.find('> .Wicket');
			return this;
		}
		Event(){
			App.Function.Request.Get(App.Language.L_72 , App.String.Concat('vc/news_detail/' , App.Storage.Session.Read('Bulletin')) , Detail => {
				this.Target.Wicket.append(App.String.Concat(`
					<div class="Tool">
						<ul class="Quantity">
							<li>
								<i class="layui-icon layui-icon-eye"></i>
								<span>` , Detail.views , `</span>
							</li>
							<li>
								<i class="layui-icon layui-icon-share"></i>
								<span>` , Detail.shares , `</span>
							</li>
						</ul>
						<div class="Time">` , App.Date.Full(Detail.created_at) , `</div>
					</div>
					<div class="Title">` , Detail.title , `</div>
					<div class="Content">` , Detail.content , `</div>
					<div class="Foot">
						<textarea placeholder="` , App.Language.L_98 , ` ..."></textarea>
						<i class="layui-icon layui-icon-release"></i>
					</div>
				`));
			});
			App.Function.Bind(this.Target.New.find('> .Head > i.layui-icon-left') , Self => {
				Self.parent().parent().remove();
			});
			App.Function.Bind(this.Target.Wicket.find('> .Foot > .layui-icon-release') , Release => {
				const Value = Release.parent().find('> textarea').val();
				if(App.Verify.Empty(Value)) return App.Layer.Error(App.Language.L_129);
				App.Const.Question = Value;
				App.Const.Quote = this.Target.Wicket.find('> .Content').text();
				return App.Function.Forward('Chat' , 'New');
			});
		}
	}
}