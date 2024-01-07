export default App => {
	return new class {
		constructor(){
			this.Template().Event();
		}
		Template(){
			App.Target.Section.append(App.String.Concat(`
				<div id="Feedback" class="Frame">
					<div class="Head layui-anim layui-anim-down">
						<i class="layui-icon layui-icon-left"></i>
						<span>OwlSync</span>
						<i class="layui-icon"></i>
					</div>
					<div class="Wicket">
						<textarea placeholder="` , App.Language.L_95 , ` ..."></textarea>
						<button>` , App.Language.L_94 , `</button>
					</div>
				</div>
			`));
			return this;
		}
		Event(){
			App.Function.Back('Account');
		}
	}
}