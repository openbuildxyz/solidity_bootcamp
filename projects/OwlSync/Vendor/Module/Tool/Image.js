'use strict';
export default App => {
	return new class {
		Crop(...Afferent){
			let [Link , Option] = Afferent;
			if(!App.Verify.Object(Option)) Option = {};
			if(!App.Verify.Number(Option.Width) || App.Verify.Lt(Option.Width , 0)) Option.Width = 0;
			if(!App.Verify.Number(Option.Height) || App.Verify.Lt(Option.Height , 0)) Option.Height = 0;
			if(!App.Verify.Number(Option.Top) || App.Verify.Lt(Option.Top , 0)) Option.Top = 0;
			if(!App.Verify.Number(Option.Left) || App.Verify.Lt(Option.Left , 0)) Option.Left = 0;
			if(!App.Verify.String(Option.Type) || App.Verify.In(['jpeg' , 'png'] , Option.Type)) Option.Type = 'jpeg';
			return new Promise((Resolve , Reject) => {
				try{
					const ObjectImage = new window.Image();
					ObjectImage.src = Link;
					ObjectImage.onload = () => {
						const ObjectCanvas = document.createElement('canvas');
						ObjectCanvas.width = (App.Verify.Elt(Option.Width , 0) ? ObjectImage.width : Option.Width);
						ObjectCanvas.height = (App.Verify.Elt(Option.Height , 0) ? ObjectImage.height : Option.Height);
						const ObjectContext = ObjectCanvas.getContext('2d');
						ObjectContext.rect(0 , 0 , ObjectCanvas.width , ObjectCanvas.height);
						if(App.Verify.Confirm(Option.Type , 'png')) ObjectContext.fillStyle = 'rgba(255 , 255 , 255 , 0)';
						ObjectContext.fill();
						Option.Type = App.String.Concat('image/' , Option.Type);
						ObjectContext.drawImage(ObjectImage , Option.Left , Option.Top , ObjectCanvas.width , ObjectCanvas.height , 0 , 0 , ObjectCanvas.width , ObjectCanvas.height);
						ObjectCanvas.setAttribute('src' , ObjectCanvas.toDataURL(Option.Type));
						Resolve(ObjectCanvas.toDataURL(Option.Type));
					}
				}catch(E){
					Reject(E);
				}
			});
		}
		Stretch(...Afferent){
			let [Link , Option] = Afferent;
			if(!App.Verify.Object(Option)) Option = {};
			if(!App.Verify.Number(Option.Width) || App.Verify.Lt(Option.Width , 0)) Option.Width = 0;
			if(!App.Verify.Number(Option.Height) || App.Verify.Lt(Option.Height , 0)) Option.Height = 0;
			if(!App.Verify.String(Option.Type) || App.Verify.In(['jpeg' , 'png'] , Option.Type)) Option.Type = 'jpeg';
			return new Promise((Resolve , Reject) => {
				try{
					const ObjectImage = new window.Image();
					ObjectImage.src = Link;
					ObjectImage.onload = () => {
						if(App.Verify.Elt(Option.Width , 0) && App.Verify.Elt(Option.Height , 0)){
							Option.Width = ObjectImage.width;
							Option.Height = ObjectImage.height;
						}else if(App.Verify.Elt(Option.Width , 0)){
							Option.Width = App.Number.Floor(App.Calculate.Mul(ObjectImage.width , App.Calculate.Div(Option.Height , ObjectImage.height)));
						}else if(App.Verify.Elt(Option.Height , 0)){
							Option.Height = App.Number.Floor(App.Calculate.Mul(ObjectImage.height , App.Calculate.Div(Option.Width , ObjectImage.width)));
						}
						const ObjectCanvas = document.createElement('canvas');
						ObjectCanvas.width = Option.Width;
						ObjectCanvas.height = Option.Height;
						const ObjectContext = ObjectCanvas.getContext('2d');
						ObjectContext.rect(0 , 0 , ObjectCanvas.width , ObjectCanvas.height);
						if(App.Verify.Confirm(Option.Type , 'png')) ObjectContext.fillStyle = 'rgba(255 , 255 , 255 , 0)';
						ObjectContext.fill();
						Option.Type = App.String.Concat('image/' , Option.Type);
						ObjectContext.drawImage(ObjectImage , 0 , 0 , ObjectCanvas.width , ObjectCanvas.height);
						ObjectCanvas.setAttribute('src' , ObjectCanvas.toDataURL(Option.Type));
						Resolve(ObjectCanvas.toDataURL(Option.Type));
					}
				}catch(E){
					Reject(E);
				}
			});
		}
		Compress(...Afferent){
			let [Link , Option] = Afferent;
			if(!App.Verify.Object(Option)) Option = {};
			if(!App.Verify.Number(Option.Scale) || App.Verify.Between(Option.Scale , 1 , 100)) Option.Scale = 100;
			if(!App.Verify.String(Option.Type) || App.Verify.In(['jpeg' , 'png'] , Option.Type)) Option.Type = 'jpeg';
			return new Promise((Resolve , Reject) => {
				try{
					const ObjectImage = new window.Image();
					ObjectImage.src = Link;
					ObjectImage.onload = () => {
						const ObjectCanvas = document.createElement('canvas');
						ObjectCanvas.width = ObjectImage.width;
						ObjectCanvas.height = ObjectImage.height;
						const ObjectContext = ObjectCanvas.getContext('2d');
						ObjectContext.rect(0 , 0 , ObjectCanvas.width , ObjectCanvas.height);
						if(App.Verify.Confirm(Option.Type , 'png')) ObjectContext.fillStyle = 'rgba(255 , 255 , 255 , 0)';
						ObjectContext.fill();
						Option.Type = App.String.Concat('image/' , Option.Type);
						ObjectContext.drawImage(ObjectImage , 0 , 0 , ObjectCanvas.width , ObjectCanvas.height);
						ObjectCanvas.setAttribute('src' , ObjectCanvas.toDataURL(Option.Type));
						Resolve(ObjectCanvas.toDataURL(Option.Type , App.Number.Convert(App.Number.Fixed(App.Calculate.Div(Option.Scale , 100) , 2))));
					}
				}catch(E){
					Reject(E);
				}
			});
		}
		Base64(...Afferent){
			let [Link , Type] = Afferent;
			if(!App.Verify.String(Type) || App.Verify.In(['jpeg' , 'png'] , Type)) Type = 'jpeg';
			return new Promise((Resolve , Reject) => {
				try{
					const ObjectImage = new window.Image();
					ObjectImage.src = Link;
					ObjectImage.onload = () => {
						const ObjectCanvas = document.createElement('canvas');
						ObjectCanvas.width = ObjectImage.width;
						ObjectCanvas.height = ObjectImage.height;
						const ObjectContext = ObjectCanvas.getContext('2d');
						ObjectContext.rect(0 , 0 , ObjectCanvas.width , ObjectCanvas.height);
						if(App.Verify.Confirm(Type , 'png')) ObjectContext.fillStyle = 'rgba(255 , 255 , 255 , 0)';
						ObjectContext.fill();
						Type = App.String.Concat('image/' , Type);
						ObjectContext.drawImage(ObjectImage , 0 , 0 , ObjectCanvas.width , ObjectCanvas.height);
						ObjectCanvas.setAttribute('src' , ObjectCanvas.toDataURL(Type));
						Resolve(ObjectCanvas.toDataURL(Type));
					}
				}catch(E){
					Reject(E);
				}
			});
		}
		Poster(Afferent){
			if(!App.Verify.Object(Afferent)) Afferent = {};
			if(!App.Verify.Number(Afferent.Width) || App.Verify.Elt(Afferent.Width , 0)) Afferent.Width = 250;
			if(!App.Verify.Number(Afferent.Height) || App.Verify.Elt(Afferent.Height , 0)) Afferent.Height = 500;
			if(!App.Verify.Require(Afferent.Background , 'string')) Afferent.Background = '#fff';
			if(!App.Verify.Array(Afferent.Data)) Afferent.Data = [];
			Afferent.Loop = (...Option) => {
				const [Data , Index , ObjectCanvas , ObjectContext , Resolve] = Option;
				const Length = App.Util.Length(Data);
				App.Each.Loop.Add(Index , Length , 1 , Current => {
					const CurrentData = Data[Current];
					if(!App.Verify.Require(CurrentData , 'object')) return true;
					if(App.Verify.Require(CurrentData.Link , 'string')){
						const ObjectImage = new window.Image();
						ObjectImage.src = CurrentData.Link;
						ObjectImage.onload = () => {
							if(!App.Verify.Number(CurrentData.Width) || App.Verify.Lt(CurrentData.Width , 0)) CurrentData.Width = 0;
							if(!App.Verify.Number(CurrentData.Height) || App.Verify.Lt(CurrentData.Height , 0)) CurrentData.Height = 0;
							if(App.Verify.Eq(CurrentData.Width , 0)) CurrentData.Width = ObjectImage.width;
							if(App.Verify.Eq(CurrentData.Height , 0)) CurrentData.Height = ObjectImage.height;
							if(!App.Verify.Number(CurrentData.Top)) CurrentData.Top = App.Number.Floor(App.Calculate.Div(App.Calculate.Sub(ObjectCanvas.height , CurrentData.Height)));
							if(!App.Verify.Number(CurrentData.Left)) CurrentData.Left = App.Number.Floor(App.Calculate.Div(App.Calculate.Sub(ObjectCanvas.width , CurrentData.Width)));
							ObjectContext.drawImage(ObjectImage , 0 , 0 , CurrentData.Width , CurrentData.Height , CurrentData.Left , CurrentData.Top , CurrentData.Width , CurrentData.Height);
							ObjectCanvas.setAttribute('src' , ObjectCanvas.toDataURL('image/png'));
							Current = App.Calculate.Add(Current , 1);
							if(App.Verify.Eq(Current , Length)){
								Resolve(ObjectCanvas.toDataURL('image/jpeg'));
							}else{
								Afferent.Loop(Data , Current , ObjectCanvas , ObjectCanvas , Resolve);
							}
						}
						return false;
					}else if(App.Verify.Require(CurrentData.Text , 'string')){
						if(!App.Verify.Number(CurrentData.Top)) CurrentData.Top = App.Number.Floor(App.Calculate.Div(ObjectCanvas.height , 2));
						if(!App.Verify.Number(CurrentData.Left)) CurrentData.Left = App.Number.Floor(App.Calculate.Div(ObjectCanvas.width , 2));
						if(!App.Verify.Require(CurrentData.Color , 'string')) CurrentData.Color = '#333';
						if(!App.Verify.Require(CurrentData.Align , 'string')) CurrentData.Align = 'center';
						if(!App.Verify.Integer(CurrentData.Size) || App.Verify.Elt(CurrentData.Size , 0)) CurrentData.Size = 24;
						if(!App.Verify.Integer(CurrentData.Weight) || App.Verify.Elt(CurrentData.Weight , 0)) CurrentData.Weight = 400;
						ObjectContext.fillStyle = CurrentData.Color;
						ObjectContext.textAlign = CurrentData.Align;
						ObjectContext.font = App.String.Concat('normal ' , CurrentData.Weight , ' ' , CurrentData.Size , 'px' , ' ' , 'Courier New');
						ObjectContext.fillText(CurrentData.Text , CurrentData.Left , CurrentData.Top);
						if(App.Verify.Eq(App.Calculate.Add(Current , 1) , Length)) return Resolve(ObjectCanvas.toDataURL('image/jpeg'));
						return true;
					}
				});
			}
			return new Promise((Resolve , Reject) => {
				try{
					const ObjectCanvas = document.createElement('canvas');
					ObjectCanvas.width = Afferent.Width;
					ObjectCanvas.height = Afferent.Height;
					const ObjectContext = ObjectCanvas.getContext('2d');
					ObjectContext.rect(0 , 0 , ObjectCanvas.width , ObjectCanvas.height);
					ObjectContext.fillStyle = Afferent.Background;
					ObjectContext.fill();
					Afferent.Loop(Afferent.Data , 0 , ObjectCanvas , ObjectContext , Resolve);
				}catch(E){
					Reject(E);
				}
			});
		}
		Qrcode(...Afferent){
			const [Link , Option] = Afferent;
			if(!App.Verify.Object(Option)) Option = {};
			if(!App.Verify.String(Option.Logo)) Option.Logo = '';
			if(!App.Verify.String(Option.Background)) Option.Background = '#fff';
			if(!App.Verify.String(Option.Foreground)) Option.Foreground = '#000';
			if(!App.Verify.Number(Option.Width) || App.Verify.Elt(Option.Width , 0)) Option.Width = 250;
			if(!App.Verify.Number(Option.Height) || App.Verify.Elt(Option.Height , 0)) Option.Height = 250;
			return new Promise((Resolve , Reject) => {
				try{
					const Qrcode = App.Qrcode({
						width : Option.Width ,
						height : Option.Height ,
						background : Option.Background ,
						foreground : Option.Foreground ,
						img : 2 ,
						text : Link ,
					});
					if(App.Verify.Empty(Option.Logo)) return Resolve(Qrcode);
					const ObjectImage = new window.Image();
					ObjectImage.src = Qrcode;
					ObjectImage.onload = () => {
						const ObjectCanvas = document.createElement('canvas');
						ObjectCanvas.width = ObjectImage.width;
						ObjectCanvas.height = ObjectImage.height;
						const ObjectContext = ObjectCanvas.getContext('2d');
						ObjectContext.rect(0 , 0 , ObjectCanvas.width , ObjectCanvas.height);
						ObjectContext.fillStyle = 'rgba(255 , 255 , 255 , 0)';
						ObjectContext.fill();
						ObjectContext.drawImage(ObjectImage , 0 , 0 , ObjectCanvas.width , ObjectCanvas.height);
						ObjectCanvas.setAttribute('src' , ObjectCanvas.toDataURL('image/png'));
						const ObjectLogoImage = new window.Image();
						ObjectLogoImage.src = Option.Logo;
						ObjectLogoImage.onload = () => {
							const Width = App.Number.Floor(App.Calculate.Div(Option.Width , 3));
							const Height = App.Number.Floor(App.Calculate.Div(Option.Height , 3));
							const Left = App.Number.Floor(App.Calculate.Sub(App.Calculate.Div(Option.Width , 2) , App.Calculate.Div(Width , 2)));
							const Top = App.Number.Floor(App.Calculate.Sub(App.Calculate.Div(Option.Height , 2) , App.Calculate.Div(Height , 2)));
							ObjectContext.drawImage(ObjectLogoImage , Left , Top , Width , Height);
							ObjectCanvas.setAttribute('src' , ObjectCanvas.toDataURL('image/png'));
							Resolve(ObjectCanvas.toDataURL('image/png'));
						}
					}
				}catch(E){
					Reject(E);
				}
			});
		}
	}
}