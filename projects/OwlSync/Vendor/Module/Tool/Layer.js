'use strict';
export default App => {
	return new class {
		Close(...Afferent){
			let [Index , Callback] = Afferent;
			if(App.Verify.Function(Index)){
				Callback = Index;
				Index = null;
			}
			if(App.Verify.Number(Index)){
				layui.layer.close(Index , () => {
					if(App.Verify.Function(Callback)) Callback();
				});
			}else{
				layui.layer.closeAll(Index , () => {
					if(App.Verify.Function(Callback)) Callback();
				});
			}
		}
		Open(Afferent){
			return layui.layer.open(App.Object.Assign({
				type : 0 ,
				title : '' ,
				content : '' ,
				area : 'auto' ,
				maxWidth : App.Calculate.Mul(App.Target.Section.outerWidth() , 0.9) ,
				maxHeight : App.Calculate.Mul(App.Target.Section.outerHeight() , 0.9) ,
				offset : 'auto' ,
				anim : 0 ,
				isOutAnim : true ,
				maxmin : false ,
				closeBtn : 1 ,
				icon : -1 ,
				btn : false ,
				btnAlign : 'r' ,
				skin : '' ,
				shade : [0.1 , '#fff'] ,
				shadeClose : true ,
				id : App.String.Uniqid() ,
				hideOnClose : false ,
				time : 0 ,
				fixed : true ,
				resize : false ,
				scrollbar : false ,
				minStack  : false ,
				removeFocus : true ,
				moveOut : false ,
				tips : 2 ,
				tipsMore : false ,
				success : (layero , index , that) => {} ,
				yes : (index , layero , that) => {} ,
				cancel : (index , layero , that) => {} ,
				end : () => {} ,
				moveEnd : (layero) => {} ,
				resizing : (layero) => {} ,
				full : (layero , index , that) => {} ,
				min : (layero , index , that) => {} ,
				restore : (layero , index , that) => {} ,
			} , Afferent));
		}
		Alert(...Afferent){
			const [Data , Callback , Option] = Afferent;
			return layui.layer.alert(Data , App.Object.Assign({
				area : '300px' ,
				anim : 0 ,
				icon : 7 ,
				shadeClose : false ,
				shade : [0.1 , '#fff'] ,
				closeBtn : 0 ,
				move : false ,
			} , (App.Verify.Object(Option) ? Option : {})) , index => {
				if(App.Verify.Function(Callback)) return Callback(index);
				App.Layer.Close(index);
			});
		}
		Error(...Afferent){
			const [Data , Callback , Option] = Afferent;
			return layui.layer.msg(Data , App.Object.Assign({
				area : '300px' ,
				anim : 6 ,
				icon : 5 ,
				time : 3000 ,
				shadeClose : false ,
				shade : [0.1 , '#fff'] ,
			} , (App.Verify.Object(Option) ? Option : {})) , () => {
				if(App.Verify.Function(Callback)) Callback();
			});
		}
		Success(...Afferent){
			const [Data , Callback , Option] = Afferent;
			return layui.layer.msg(Data , App.Object.Assign({
				area : '300px' ,
				anim : 5 ,
				icon : 6 ,
				time : 1500 ,
				shadeClose : false ,
				shade : [0.1 , '#fff'] ,
			} , (App.Verify.Object(Option) ? Option : {})) , () => {
				if(App.Verify.Function(Callback)) Callback();
			});
		}
		Loading(...Afferent){
			const [Data , Callback , Option] = Afferent;
			return this.Open(App.Object.Assign({
				title : false ,
				content : Data ,
				area : '300px' ,
				closeBtn : 0 ,
				icon : 16 ,
				shadeClose : false ,
				shade : [0.1 , '#fff'] ,
				success : (layero , index) => {
					if(App.Verify.Function(Callback)) Callback(index);
				} ,
			} , (App.Verify.Object(Option) ? Option : {})));
		}
		Confirm(...Afferent){
			const [Data , Callback , Option] = Afferent;
			return layui.layer.confirm(Data , App.Object.Assign({
				area : '300px' ,
				anim : 0 ,
				icon : 3 ,
				shadeClose : false ,
				shade : [0.1 , '#fff'] ,
				closeBtn : 0 ,
			} , (App.Verify.Object(Option) ? Option : {})) , index => {
				if(App.Verify.Function(Callback)) return Callback(index);
				App.Layer.Close(index);
			});
		}
		Tip(...Afferent){
			const [Data , Element , Option] = Afferent;
			return layui.layer.tips(Data , Element , App.Object.Assign({
				tips : 1 ,
				tipsMore : false ,
			} , (App.Verify.Object(Option) ? Option : {})));
		}
		Prompt(...Afferent){
			const [Callback , Option] = Afferent;
			return layui.layer.prompt(App.Object.Assign({
				formType : 0 ,
				value : '' ,
				title : '' ,
				area : 'auto' ,
				maxlength : 65535 ,
				placeholder : '' ,
			} , Option) , (value , index , elem) => {
				if(App.Verify.Function(Callback)) return Callback(value , index);
				App.Layer.Close(index);
			});
		}
		Photo(...Afferent){
			const [Data , Callback , Option] = Afferent;
			return layui.layer.photos({
				photos : App.Object.Assign({
					title : '' ,
					id : App.String.Uniqid() ,
					start : 0 ,
					data : [] ,
				} , (App.Verify.Object(Option) ? Option : {}) , {
					data : Data ,
				}) ,
				tab : (data , layero) => {
					if(App.Verify.Function(Callback)) return Callback(data , layero);
					App.Layer.Close(index);
				} ,
			});
		}
	}
}