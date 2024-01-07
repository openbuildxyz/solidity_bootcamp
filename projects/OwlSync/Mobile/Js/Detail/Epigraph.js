export default App => {
	return new class {
		constructor(){
			this.Template().Event();
		}
		Template(){
			App.Target.Section.append(`
				<div id="Inscription" class="Frame">
					<div class="Head layui-anim layui-anim-down">
						<i class="layui-icon layui-icon-left"></i>
						<span>OwlSync</span>
						<i class="layui-icon"></i>
					</div>
					<div class="Wicket">
						<div class="Coin">
							<img src="/Mobile/Image/t3.png" />
							<span>ORDI</span>
							<span>$23.33</span>
						</div>
						<ul class="Detail">
							<li>
								<span>24H交易额</span>
								<span>2.529 BTC</span>
								<span>$108.96</span>
							</li>
							<li>
								<span>总交易额</span>
								<span>257.3655 BTC</span>
								<span>$11.08M</span>
							</li>
							<li>
								<span>地板价</span>
								<span>$57.44</span>
								<span>133333 SATS</span>
							</li>
							<li>
								<span>持有人</span>
								<span>13672 人</span>
								<span>213.24K 笔交易</span>
							</li>
							<li>
								<span>总供应量</span>
								<span>21000000</span>
							</li>
							<li>
								<span>单次铸造上限</span>
								<span>1000</span>
							</li>
							<li>
								<span>创建时间</span>
								<span>2022-10-1</span>
							</li>
							<li>
								<span>精度</span>
								<span>18</span>
							</li>
							<li>
								<span>起始编号</span>
								<span>#348020</span>
							</li>
							<li>
								<span>结尾编号</span>
								<span>#384419</span>
							</li>
						</ul>
						<div id="Analysis">
							<img src="/Mobile/Image/t4.png" />
						</div>
						<ul class="Address">
							<li>
								<span>bc1qhu...du7d</span>
								<span>8,73,753.988</span>
								<span>99.55%</span>
								<em><i style="width:40.35%"></i></em>
							</li>
							<li>
								<span>bc1qhu...du7d</span>
								<span>8,3,753.988</span>
								<span>40.35%</span>
								<em><i style="width:40.35%"></i></em>
							</li>
							<li>
								<span>bc1qhu...du7d</span>
								<span>8,473,753.988</span>
								<span>40.35%</span>
								<em><i style="width:40.35%"></i></em>
							</li>
							<li>
								<span>bc1qhu...du7d</span>
								<span>8,73,753.988</span>
								<span>40.35%</span>
								<em><i style="width:40.35%"></i></em>
							</li>
						</ul>
					</div>
				</div>
			`);
			this.Target = {};
			this.Target.Inscription = App.Target.Section.find('> #Inscription');
			this.Target.Wicket = this.Target.Inscription.find('> .Wicket');
			return this;
		}
		Event(){
			App.Function.Back('Epigraph');
		}
	}
}