export default App => {
	return new class {
		constructor(){
			this.Template().Event();
		}
		Template(){
			App.Target.Section.append(`
				<div id="Program" class="Frame">
					<div class="Head layui-anim layui-anim-down">
						<i class="layui-icon layui-icon-left"></i>
						<span>OwlSync</span>
						<i class="layui-icon"></i>
					</div>
					<div class="Wicket"></div>
				</div>
			`);
			this.Target = {};
			this.Target.Program = App.Target.Section.find('> #Program');
			this.Target.Wicket = this.Target.Program.find('> .Wicket');
			return this;
		}
		Event(){
			App.Function.Request.Get(App.Language.L_72 , App.String.Concat('vc/coin_info/' , App.Storage.Session.Read('Program')) , Detail => {
				if(App.Verify.Empty(Detail)) return App.Layer.Error('当前币信息异常，请稍后重试' , () => {
					return App.Function.Forward('Project' , 'Program');
				});
				const Icon = App.Storage.Session.Read('Icon');
				this.Target.Wicket.append(App.String.Concat(`
					<div class="Detail">
						` , (App.Verify.Empty(Icon) ? `` : App.String.Concat(`<img src="` , Icon , `" />`)) , `
						<div class="Name">
							<span>` , Detail.name , `</span>
							<span>` , App.String.Upper(Detail.status) , `</span>
						</div>
						<div class="Description">
							<p>` , Detail.description , `</p>
							<span class="layui-hide">` , App.Language.L_99 , `</span>
						</div>
					</div>
					<ul class="Flow">
						<li>
							<span>$` , App.Number.Fixed(Detail.statistics.price , 4) , `</span>
							<span class="` , (App.Verify.Gt(Detail.statistics.priceChangePercentage24h , 0) ? `Green` : `Red`) , `">` , (() => {
								const Percent = App.Number.Fixed(Detail.statistics.priceChangePercentage24h , 2);
								if(App.Verify.In(Percent , '-')) return Percent;
								return App.String.Concat('+' , Percent);
							})() , `%(1d)</span>
						</li>
						<li>
							<span>$` , App.Number.Fixed(Detail.statistics.high24h , 2) , `</span>
							<span>` , App.Language.L_100 , `</span>
						</li>
						<li>
							<span>$` , App.Number.Fixed(Detail.statistics.highAllTime , 2) , `</span>
							<span>` , App.Language.L_101 , `</span>
						</li>
						<li>
							<span>$` , (() => {
								let Market = App.Calculate.Div(Detail.statistics.marketCap , 1000000000);
								if(App.Verify.Gt(Market , 10)) return App.String.Concat(App.Number.Fixed(Market , 2) , 'B');
								Market = App.Calculate.Div(Detail.statistics.marketCap , 1000000);
								if(App.Verify.Gt(Market , 10)) return App.String.Concat(App.Number.Fixed(Market , 2) , 'M');
								return App.Number.Fixed(Market , 2);
							})() , `</span>
							<span>` , App.Language.L_102 , `</span>
						</li>
						<li>
							<span>$` , App.Number.Fixed(Detail.statistics.low24h , 2) , `</span>
							<span>` , App.Language.L_103 , `</span>
						</li>
						<li>
							<span>$` , App.Number.Fixed(Detail.statistics.lowAllTime , 2) , `</span>
							<span>` , App.Language.L_104 , `</span>
						</li>
					</ul>
					<div id="Chart"></div>
					<div id="Table_` , App.String.Uniqid() , `" class="Table layui-hide"></div>
					<ul class="Foot">
						<li class="Hover">` , App.Language.L_105 , `</li>
						<li>` , App.Language.L_106 , `</li>
						<li>` , App.Language.L_107 , `</li>
						<li>` , App.Language.L_108 , `</li>
					</ul>
				`));
				const Height = this.Target.Wicket.find('> .Detail > .Description > p')[0].scrollHeight;
				if(App.Verify.Gt(Height , 50)){
					this.Target.Wicket.find('> .Detail > .Description > span').removeClass('layui-hide');
					App.Function.Bind(this.Target.Wicket.find('> .Detail > .Description > span') , Self => {
						if(Self.parent().find('> p').hasClass('Hover')){
							Self.text(App.Language.L_99).parent().find('> p').removeClass('Hover').animate({
								scrollTop : 0 ,
							} , 0);
						}else{
							Self.text(App.Language.L_128).parent().find('> p').addClass('Hover');
						}
					});
				}
				App.Function.Request.Get('' , App.String.Concat('vc/geo_info?' , App.Object.Url({
					code : App.Storage.Session.Read('Program') ,
					start : 1 ,
					limit : 30 ,
				})) , Request => {
					layui.table.render({
						elem : this.Target.Wicket.find('> .Table') ,
						data : Request.marketPairs ,
						cols : [[{
							title : App.Language.L_109 ,
							align : 'center' ,
							fixed : 'left' ,
							width : 100 ,
							templet : Data => {
								return Data.exchangeName;
							} ,
						} , {
							title : App.Language.L_110 ,
							align : 'center' ,
							width : 100 ,
							templet : Data => {
								return Data.marketPair;
							} ,
						} , {
							title : App.Language.L_111 ,
							align : 'center' ,
							width : 100 ,
							templet : Data => {
								return App.String.Concat('$' , App.Number.Fixed(Data.price , 2));
							} ,
						} , {
							title : App.String.Concat('+2% ' , App.Language.L_112) ,
							align : 'center' ,
							width : 150 ,
							templet : Data => {
								return App.String.Concat('$' , App.Number.Fixed(Data.depthUsdPositiveTwo , 2));
							} ,
						} , {
							title : App.String.Concat('-2% ' , App.Language.L_112) ,
							align : 'center' ,
							width : 150 ,
							templet : Data => {
								return App.String.Concat('$' , App.Number.Fixed(Data.depthUsdNegativeTwo , 2));
							} ,
						} , {
							title : App.String.Concat(App.Language.L_113 , '(24H)') ,
							align : 'center' ,
							width : 150 ,
							templet : Data => {
								return App.String.Concat('$' , App.Number.Fixed(Data.volumeQuote , 2));
							} ,
						} , {
							title : App.String.Concat(App.Language.L_113 , ' %') ,
							align : 'center' ,
							width : 100 ,
							templet : Data => {
								return App.String.Concat(App.Number.Fixed(Data.volumePercent , 2) , '%');
							} ,
						}]] ,
						width : App.Calculate.Sub(this.Target.Wicket.outerWidth() , 20) ,
						height : 300 ,
						limit : 9999999 ,
						scrollPos : 'fixed' ,
						even : true ,
					});
				} , () => {});
				new this.Chart(Detail);
				new this.Analytics(Detail);
				const Panel = new this.Panel(Detail);
				App.Function.Bind(this.Target.Wicket.find('> .Foot > li') , Self => {
					if(Self.hasClass('Hover')) return false;
					Self.addClass('Hover').siblings('li').removeClass('Hover');
					if(App.Verify.Eq(Self.index() , 0)) return Panel.Brief();
					if(App.Verify.Eq(Self.index() , 1)) return Panel.Bulletin();
					if(App.Verify.Eq(Self.index() , 2)) return Panel.Twitter();
					if(App.Verify.Eq(Self.index() , 3)) return Panel.Paper();
				});
				Panel.Twitter();
			} , () => {
				return App.Function.Forward('Project' , 'Program');
			});
			App.Function.Back('Project');
		}
		Panel = class {
			constructor(Detail){
				this.Detail = Detail;
				this.Target = {};
				this.Target.Wicket = App.Target.Section.find('> #Program > .Wicket');
				this.Target.Bulletin = this.Target.Wicket.find('> #Bulletin');
				this.Target.Twitter = this.Target.Wicket.find('> #Twitter');
				this.Target.Paper = this.Target.Wicket.find('> #Paper');
			}
			Brief(){
				this.Target.Bulletin.addClass('layui-hide');
				this.Target.Twitter.addClass('layui-hide');
				this.Target.Paper.addClass('layui-hide');
			}
			Bulletin(){
				this.Target.Twitter.addClass('layui-hide');
				this.Target.Paper.addClass('layui-hide');
				if(App.Verify.Length(this.Target.Bulletin , 1)) return this.Target.Bulletin.removeClass('layui-hide');
				this.Target.Wicket.append(`<div id="Bulletin" class="Panel layui-anim layui-anim-up"></div>`);
				this.Target.Bulletin = this.Target.Wicket.find('> #Bulletin');
				App.Function.Request.Get(App.Language.L_72 , App.String.Concat('vc/news/' , this.Detail.id) , Request => {
					const Template = [];
					App.Each.Of(Request.list , Item => {
						App.Array.Push(Template , App.String.Concat(`
							<li data-bulletin="` , Item.news_id , `">
								<div class="Time">` , App.Date.Friend(Item.createdAt , true) , `</div>
								<div class="Title">` , Item.title , `</div>
								<img src="` , Item.cover , `" />
							</li>
						`));
						return true;
					});
					if(!App.Verify.Empty(Template)){
						this.Target.Bulletin.append(App.String.Concat(`
							<ul>
								` , App.Array.Join(Template) , `
								<div class="Line"></div>
							</ul>
						`));
						App.Function.Bind(this.Target.Bulletin.find('> ul > li > .Title') , Self => {
							if(App.Verify.Empty(Self.parent().attr('data-bulletin'))) return false;
							App.Storage.Session.Write('Bulletin' , Self.parent().attr('data-bulletin'));
							return App.Function.Forward('Detail/Bulletin');
						});
					}
				} , () => {});
			}
			Twitter(){
				this.Target.Bulletin.addClass('layui-hide');
				this.Target.Paper.addClass('layui-hide');
				if(App.Verify.Length(this.Target.Twitter , 1)) return this.Target.Twitter.removeClass('layui-hide');
				this.Target.Wicket.append(App.String.Concat(`
					<div id="Twitter" class="Panel layui-anim layui-anim-up layui-hide">
						<ul>
							<li>
								<div class="Question">` , App.Language.L_114 , `</div>
								<div class="Content">` , App.Language.L_122 , `</div>
								<div class="Go">` , App.Language.L_123 , `<span>` , App.Language.L_124 , `</span></div>
							</li>
							<li>
								<div class="Question">` , App.Language.L_115 , `</div>
								<div class="Content">` , App.Language.L_122 , `</div>
								<div class="Go">` , App.Language.L_123 , `<span>` , App.Language.L_124 , `</span></div>
							</li>
							<li>
								<div class="Question">` , App.Language.L_116 , `</div>
								<div class="Content">` , App.Language.L_122 , `</div>
								<div class="Go">` , App.Language.L_123 , `<span>` , App.Language.L_124 , `</span></div>
							</li>
							<li>
								<div class="Question">` , App.Language.L_117 , `</div>
								<div class="Content">` , App.Language.L_122 , `</div>
								<div class="Go">` , App.Language.L_123 , `<span>` , App.Language.L_124 , `</span></div>
							</li>
						</ul>
					</div>
				`));
				this.Target.Twitter = this.Target.Wicket.find('> #Twitter');
				App.Function.Request.Get('' , App.String.Concat('vc/twitter_sum_up/' , App.Storage.Session.Read('Program')) , Request => {
					if(!App.Verify.Empty(Request.content)) this.Target.Twitter.find('> ul > li:nth-child(1) > .Content').addClass('Complete').text(Request.content);
				} , () => {});
				App.Function.Bind(this.Target.Twitter.find('> ul > li > .Go > span') , Self => {
					const Content = Self.parent().parent().find('> .Content');
					if(Content.hasClass('Complete')) App.Const.Quote = Content.text();
					return App.Function.Forward('Chat' , 'Program');
				});
			}
			Paper(){
				this.Target.Bulletin.addClass('layui-hide');
				this.Target.Twitter.addClass('layui-hide');
				if(App.Verify.Length(this.Target.Paper , 1)) return this.Target.Paper.removeClass('layui-hide');
				this.Target.Wicket.append(App.String.Concat(`
					<div id="Paper" class="Panel layui-anim layui-anim-up">
						<ul>
							<li>
								<div class="Question">` , App.Language.L_118 , `</div>
								<div class="Content">` , App.Language.L_122 , `</div>
								<div class="Go">` , App.Language.L_123 , `<span>` , App.Language.L_124 , `</span></div>
							</li>
							<li>
								<div class="Question">` , App.Language.L_119 , `</div>
								<div class="Content">` , App.Language.L_122 , `</div>
								<div class="Go">` , App.Language.L_123 , `<span>` , App.Language.L_124 , `</span></div>
							</li>
							<li>
								<div class="Question">` , App.Language.L_120 , `</div>
								<div class="Content">` , App.Language.L_122 , `</div>
								<div class="Go">` , App.Language.L_123 , `<span>` , App.Language.L_124 , `</span></div>
							</li>
							<li>
								<div class="Question">` , App.Language.L_121 , `</div>
								<div class="Content">` , App.Language.L_122 , `</div>
								<div class="Go">` , App.Language.L_123 , `<span>` , App.Language.L_124 , `</span></div>
							</li>
						</ul>
					</div>
				`));
				this.Target.Paper = this.Target.Wicket.find('> #Paper');
				App.Function.Request.Get('' , App.String.Concat('vc/whitepaper_analyze/' , App.Storage.Session.Read('Program')) , Request => {
					if(!App.Verify.Object(Request.info)) return false;
					if(!App.Verify.Empty(Request.info.token_modle)) this.Target.Paper.find('> ul > li:nth-child(1) > .Content').addClass('Complete').text(Request.info.token_modle);
					if(!App.Verify.Empty(Request.info.development_route)) this.Target.Paper.find('> ul > li:nth-child(2) > .Content').addClass('Complete').text(Request.info.development_route);
					if(!App.Verify.Empty(Request.info.competitor)) this.Target.Paper.find('> ul > li:nth-child(3) > .Content').addClass('Complete').text(Request.info.competitor);
					if(!App.Verify.Empty(Request.info.future)) this.Target.Paper.find('> ul > li:nth-child(4) > .Content').addClass('Complete').text(Request.info.future);
				} , () => {});
				App.Function.Bind(this.Target.Paper.find('> ul > li > .Go > span') , Self => {
					const Content = Self.parent().parent().find('> .Content');
					if(Content.hasClass('Complete')) App.Const.Quote = Content.text();
					return App.Function.Forward('Chat' , 'Program');
				});
			}
		}
		Analytics = class {
			constructor(Detail){
				this.Detail = Detail;
				this.Target = {};
				this.Update();
			}
			Update(){
				App.Function.Request.Get('' , App.String.Concat('vc/analytics?' , App.Object.Url({
					cid : this.Detail.id ,
					type : 'year1' ,
				})) , Request => {
					this.Request = Request;
					App.Target.Section.find('> #Program > .Wicket > .Foot').before(`
						<div id="Analytics1"></div>
						<div id="Analytics2"></div>
						<div id="Analytics3"></div>
					`);
					this.Target.Analytics1 = echarts.init(document.getElementById('Analytics1') , null, {locale: 'en'});
					this.Target.Analytics2 = echarts.init(document.getElementById('Analytics2') , null, {locale: 'en'});
					this.Target.Analytics3 = echarts.init(document.getElementById('Analytics3') , null, {locale: 'en'});
					this.Analytics1();
					this.Analytics2();
					this.Analytics3();
				} , () => {});
			}
			Analytics1(){
				const Option = {
					grid : [{
						top : '50px' ,
						left : '70px' ,
						right : '10px' ,
						bottom : '30px' ,
					}] ,
					title : {
						text : App.Language.L_125 ,
						left : 'center' ,
						top : '10px' ,
					} ,
					tooltip : {
						trigger : 'axis' ,
					} ,
					xAxis : {
						type : 'time' ,
						data : this.Request.addressesByHoldings.addressesByHoldingsDetails.map(Item => Item.date) ,
					} ,
					yAxis : [{
						type : 'value' ,
						position : 'left' ,
					}] ,
					series : [{
						name : '$0-$1k' ,
						type : 'line' ,
						symbol : 'none' ,
						data : this.Request.addressesByHoldings.addressesByHoldingsDetails.map(Item => [Item.date , Item.addresses0To1K]) ,
					} , {
						name : '$1-$100k' ,
						type : 'line' ,
						symbol : 'none' ,
						data : this.Request.addressesByHoldings.addressesByHoldingsDetails.map(Item => [Item.date , Item.addresses1KTo100K]) ,
					} , {
						name : '$100k+' ,
						type : 'line' ,
						symbol : 'none' ,
						data : this.Request.addressesByHoldings.addressesByHoldingsDetails.map(Item => [Item.date , Item.addresses100KPlus]) ,
					}]
				};
				this.Target.Analytics1.setOption(Option);
			}
			Analytics2(){
				const Option = {
					grid : [{
						top : '50px' ,
						left : '70px' ,
						right : '10px' ,
						bottom : '30px' ,
					}] ,
					title : {
						text : App.Language.L_126 ,
						left : 'center' ,
						top : '10px' ,
					} ,
					tooltip : {
						trigger : 'axis' ,
					} ,
					xAxis : {
						type : 'time' ,
						data : this.Request.historicalConcentration.historicalConcentrationDetails.map(Item => Item.date) ,
					} ,
					yAxis : [{
						type : 'value' ,
						position : 'left' ,
						axisLabel : {
							formatter : value => {
								return this.Format(value);
							} ,
						} ,
					}] ,
					graphic : [{
						type : 'text' ,
						left : 'center' ,
						top : '7%' ,
						style : {
							text : '' ,
							fontSize : 14 ,
						} ,
					}] ,
					series : [{
						name : 'whales' ,
						type : 'line' ,
						symbol : 'none' ,
						tooltip : {
							valueFormatter : value => this.Format(value) ,
						} ,
						data : this.Request.historicalConcentration.historicalConcentrationDetails.map(Item => [Item.date, Item.whales]) ,
					} , {
						name : 'investors' ,
						type : 'line' ,
						symbol : 'none' ,
						tooltip : {
							valueFormatter : value => this.Format(value) ,
						} ,
						data : this.Request.historicalConcentration.historicalConcentrationDetails.map(Item => [Item.date, Item.investors]) ,
					} , {
						name : 'retail' ,
						type : 'line' ,
						symbol : 'none' ,
						tooltip : {
							valueFormatter : value => this.Format(value) ,
						} ,
						data : this.Request.historicalConcentration.historicalConcentrationDetails.map(Item => [Item.date, Item.retail]) ,
					}] ,
				};
				this.Target.Analytics2.setOption(Option);
			}
			Analytics3(){
				const Option = {
					grid : [{
						top : '50px' ,
						left : '70px' ,
						right : '10px' ,
						bottom : '30px' ,
					}] ,
					title : {
						text : App.Language.L_127 ,
						left : 'center' ,
						top : '10px' ,
					} ,
					tooltip : {
						trigger : 'axis' ,
					} ,
					xAxis : {
						type : 'time' ,
						data : this.Request.addressByTimeHeld.addressByTimeHeldDetails.map(Item => Item.date) ,
					} ,
					yAxis : [{
						type : 'value' ,
						position : 'left' ,
					}] ,
					graphic : [{
						type : 'text' ,
						left : 'center' ,
						top : '7%' ,
						style : {
							text : '' ,
							fontSize : 14 ,
						} ,
					}] ,
					series : [{
						name : 'Cruisers' ,
						type : 'line' ,
						symbol : 'none' ,
						data : this.Request.addressByTimeHeld.addressByTimeHeldDetails.map(Item => [Item.date , Item.cruisers]) ,
					} , {
						name : 'Traders' ,
						type : 'line' ,
						symbol : 'none' ,
						data : this.Request.addressByTimeHeld.addressByTimeHeldDetails.map(Item => [Item.date , Item.traders]) ,
					} , {
						name : 'Holders' ,
						type : 'line' ,
						symbol : 'none' ,
						data : this.Request.addressByTimeHeld.addressByTimeHeldDetails.map(Item => [Item.date , Item.holders]) ,
					}] ,
				};
				this.Target.Analytics3.setOption(Option);
			}
			Format(Data){
				if(App.Verify.Gt(Data , 1000000000)) return App.String.Concat(App.Number.Fixed(App.Calculate.Div(Data , 1000000000) , 2) , 'B');
				if(App.Verify.Gt(Data , 1000000)) return App.String.Concat(App.Number.Fixed(App.Calculate.Div(Data , 1000000) , 2) , 'M');
				return App.Number.Fixed(Data , 2);
			}
		}
		Chart = class {
			constructor(Detail){
				this.Detail = Detail;
				this.Chart = echarts.init(document.getElementById('Chart') , null, {locale: 'en'});
				this.Update();
			}
			Option(){
				return {
					grid : [{
						top : '10px' ,
						left : '15px' ,
						right : '60px' ,
						bottom : '30px' ,
					}] ,
					xAxis : {
						type : 'time' ,
						data : [] ,
					} ,
					yAxis : [{
						type : 'value' ,
						position : 'right' ,
						axisLabel : {
							formatter : value => {
								return App.String.Concat('$' , App.Number.Fixed(value , (App.Verify.Gt(value , 1000) ? 1 : (App.Verify.Gt(value , 100) ? 2 : (App.Verify.Gt(value , 10) ? 3 : 4)))));
							} ,
						} ,
						min : value => {
							let X = App.Calculate.Div(App.Number.Floor(App.Calculate.Mul(App.Calculate.Sub(value.min , App.Calculate.Div(App.Calculate.Mul(App.Calculate.Sub(value.max , value.min) , 75) , 100)) , 1000)) , 1000);
							if(App.Verify.Lt(X , 0)) X = 0;
							return X;
						} ,
						max : value => {
							return App.Calculate.Div(App.Number.Ceil(App.Calculate.Mul(value.max , 1000)) , 1000);
						} ,
					}] ,
					legend : {
						show : false ,
					} ,
					tooltip : {
						trigger : 'axis' ,
					} ,
					visualMap : [{
						show : false ,
						seriesIndex : 0 ,
						pieces : [{
							gt : 0 ,
							lt : 0 ,
							color : 'red' ,
						}] ,
						outOfRange : {
							color : 'green' ,
							borderColor : '#ff4343' ,
						} ,
					}] ,
					series : [{
						name : 'Price' ,
						type : 'line' ,
						data : [] ,
						symbol : 'none' ,
						yAxisIndex : 0 ,
						tooltip : {
							valueFormatter : value => {
								return App.String.Concat('$' , App.Number.Fixed(value , 8));
							} ,
						} ,
					}] ,
				};
			}
			Update(){
				App.Function.Request.Get('' , App.String.Concat('vc/chart?' , App.Object.Url({
					cid : this.Detail.id ,
					range : '1D' ,
				})) , Request => {
					const Data = [];
					App.Each.In(Request.points , (Key , Point) => {
						const Item = Point.v;
						App.Array.Unshift(Item , App.Date.Full(App.Calculate.Mul(Key , 1000)));
						App.Array.Push(Data , Item);
					});
					const Option = this.Option();
					Option.xAxis.data = Data.map(Item => Item[0]);
					Option.series[0].data = Data.map(Item => [Item[0] , Item[1]]);
					Option.visualMap[0].pieces[0].lt = 0.6684;
					this.Chart.setOption(Option);
				});
			}
			
		}
	}
}