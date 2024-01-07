'use strict';
export default App => {
	const Direction = Afferent => {
		const Angle = App.Number.Cop(App.Number.Round(App.Calculate.Add(App.Calculate.Div(App.Calculate.Add(App.Calculate.Mul(App.Number.Atan2(Afferent.Y , Afferent.X) , App.Calculate.Div(180 , App.Number.Pi())) , 180) , 90) , 3)) , 4);
		if(App.Verify.Eq(Angle , 0) && App.Verify.Lt(Afferent.Y , -10) && App.Verify.Lt(App.Number.Abs(Afferent.X) , App.Number.Abs(Afferent.Y))) return 0;
		if(App.Verify.Eq(Angle , 1) && App.Verify.Gt(Afferent.X , 10) && App.Verify.Gt(App.Number.Abs(Afferent.X) , App.Number.Abs(Afferent.Y))) return 1;
		if(App.Verify.Eq(Angle , 2) && App.Verify.Gt(Afferent.Y , 10) && App.Verify.Lt(App.Number.Abs(Afferent.X) , App.Number.Abs(Afferent.Y))) return 2;
		if(App.Verify.Eq(Angle , 3) && App.Verify.Lt(Afferent.X , -10) && App.Verify.Gt(App.Number.Abs(Afferent.X) , App.Number.Abs(Afferent.Y))) return 3;
		return -1;
	}
	const Call = (Afferent , Use) => {
		let [Target , Callable , Option] = Afferent;
		if(App.Verify.Object(Callable)) Option = Callable;
		if(!App.Verify.Function(Callable)) Callable = () => {};
		if(!App.Verify.Object(Option)) Option = {};
		if(!App.Verify.Number(Option.Which) || !App.Verify.In([1 , 2 , 3] , Option.Which)) Option.Which = 1;
		if(!App.Verify.Boolean(Option.Prevent)) Option.Prevent = true;
		if(!App.Verify.Boolean(Option.Unbind)) Option.Unbind = true;
		return App.Event.Auto(Target , {
			Prevent : Option.Prevent ,
			Unbind : Option.Unbind ,
			Tap(...Afferent){
				const [Self , Coordinate , Event] = Afferent;
				let Which = Event.which;
				if(App.Verify.Wap()) Which = App.Calculate.Add(Which , 1);
				if(App.Verify.Eq(Use , 1) && App.Verify.Eq(Which , Option.Which)) Callable(...Afferent);
			} ,
			Double(...Afferent){
				const [Self , Coordinate , Event] = Afferent;
				let Which = Event.which;
				if(App.Verify.Wap()) Which = App.Calculate.Add(Which , 1);
				if(App.Verify.Eq(Use , 2) && App.Verify.Eq(Which , Option.Which)) Callable(...Afferent);
			} ,
			Hold(...Afferent){
				const [Self , Coordinate , Event] = Afferent;
				let Which = Event.which;
				if(App.Verify.Wap()) Which = App.Calculate.Add(Which , 1);
				if(App.Verify.Eq(Use , 3) && App.Verify.Eq(Which , Option.Which)) Callable(...Afferent);
			} ,
			Top(...Afferent){
				const [Self , Coordinate , Event] = Afferent;
				let Which = Event.which;
				if(App.Verify.Wap()) Which = App.Calculate.Add(Which , 1);
				if(App.Verify.Eq(Use , 4) && App.Verify.Eq(Which , Option.Which)) Callable(...Afferent);
			} ,
			Right(...Afferent){
				const [Self , Coordinate , Event] = Afferent;
				let Which = Event.which;
				if(App.Verify.Wap()) Which = App.Calculate.Add(Which , 1);
				if(App.Verify.Eq(Use , 5) && App.Verify.Eq(Which , Option.Which)) Callable(...Afferent);
			} ,
			Bottom(...Afferent){
				const [Self , Coordinate , Event] = Afferent;
				let Which = Event.which;
				if(App.Verify.Wap()) Which = App.Calculate.Add(Which , 1);
				if(App.Verify.Eq(Use , 6) && App.Verify.Eq(Which , Option.Which)) Callable(...Afferent);
			} ,
			Left(...Afferent){
				const [Self , Coordinate , Event] = Afferent;
				let Which = Event.which;
				if(App.Verify.Wap()) Which = App.Calculate.Add(Which , 1);
				if(App.Verify.Eq(Use , 7) && App.Verify.Eq(Which , Option.Which)) Callable(...Afferent);
			} ,
			Move : {
				Top(...Afferent){
					const [Self , Coordinate , Event] = Afferent;
					let Which = Event.which;
					if(App.Verify.Wap()) Which = App.Calculate.Add(Which , 1);
					if(App.Verify.Eq(Use , 8) && App.Verify.Eq(Which , Option.Which)) Callable(...Afferent);
				} ,
				Right(...Afferent){
					const [Self , Coordinate , Event] = Afferent;
					let Which = Event.which;
					if(App.Verify.Wap()) Which = App.Calculate.Add(Which , 1);
					if(App.Verify.Eq(Use , 9) && App.Verify.Eq(Which , Option.Which)) Callable(...Afferent);
				} ,
				Bottom(...Afferent){
					const [Self , Coordinate , Event] = Afferent;
					let Which = Event.which;
					if(App.Verify.Wap()) Which = App.Calculate.Add(Which , 1);
					if(App.Verify.Eq(Use , 10) && App.Verify.Eq(Which , Option.Which)) Callable(...Afferent);
				} ,
				Left(...Afferent){
					const [Self , Coordinate , Event] = Afferent;
					let Which = Event.which;
					if(App.Verify.Wap()) Which = App.Calculate.Add(Which , 1);
					if(App.Verify.Eq(Use , 11) && App.Verify.Eq(Which , Option.Which)) Callable(...Afferent);
				} ,
			} ,
			Down(...Afferent){
				if(App.Verify.Eq(Option.Which , 3)) document.oncontextmenu = () => {
					return false;
				}
			} ,
			Up(...Afferent){
				if(App.Verify.Eq(Option.Which , 3)) App.Util.Timeout(() => {
					document.oncontextmenu = () => {
						return true;
					}
				} , 0.2);
			} ,
		});
	}
	return new class {
		Mouse(...Afferent){
			let [Target , Option] = Afferent;
			if(!App.Verify.Object(Option)) Option = {};
			if(!App.Verify.Boolean(Option.Prevent)) Option.Prevent = true;
			if(!App.Verify.Boolean(Option.Unbind)) Option.Unbind = true;
			if(!App.Verify.Function(Option.Tap)) Option.Tap = () => {};
			if(!App.Verify.Function(Option.Double)) Option.Double = () => {};
			if(!App.Verify.Function(Option.Hold)) Option.Hold = () => {};
			if(!App.Verify.Function(Option.Up)) Option.Up = () => {};
			if(!App.Verify.Function(Option.Down)) Option.Down = () => {};
			if(!App.Verify.Function(Option.Top)) Option.Top = () => {};
			if(!App.Verify.Function(Option.Bottom)) Option.Bottom = () => {};
			if(!App.Verify.Function(Option.Left)) Option.Left = () => {};
			if(!App.Verify.Function(Option.Right)) Option.Right = () => {};
			if(!App.Verify.Object(Option.Move)) Option.Move = {};
			if(!App.Verify.Function(Option.Move.Top)) Option.Move.Top = () => {};
			if(!App.Verify.Function(Option.Move.Bottom)) Option.Move.Bottom = () => {};
			if(!App.Verify.Function(Option.Move.Left)) Option.Move.Left = () => {};
			if(!App.Verify.Function(Option.Move.Right)) Option.Move.Right = () => {};
			if(!App.Verify.Function(Option.Move.Drag)) Option.Move.Drag = () => {};
			Option.Custom = {};
			Option.Custom.Coordinate = {};
			Option.Custom.Coordinate.X = 0;
			Option.Custom.Coordinate.Y = 0;
			Option.Custom.Difference = {};
			Option.Custom.Difference.X = 0;
			Option.Custom.Difference.Y = 0;
			Option.Custom.Double = false;
			Option.Custom.Time = 0;
			Option.Custom.Timeout = 0;
			if(Option.Unbind){
				Target.unbind('mousedown');
				Target.unbind('mousemove');
				Target.unbind('mouseup');
			}
			Target.bind('mousedown' , Event => {
				if(Option.Prevent) Event.preventDefault();
				Option.Custom.Time = App.Date.Microtime();
				Option.Custom.Coordinate.X = App.Number.Floor(Event.originalEvent.pageX);
				Option.Custom.Coordinate.Y = App.Number.Floor(Event.originalEvent.pageY);
				if(!Option.Custom.Double) Option.Down(App.$(Event.currentTarget) , Option.Custom.Coordinate , Event);
				Target.bind('mousemove' , Event => {
					if(Option.Prevent) Event.preventDefault();
					const Coordinate = {};
					Coordinate.X = App.Number.Floor(Event.originalEvent.pageX);
					Coordinate.Y = App.Number.Floor(Event.originalEvent.pageY);
					Option.Custom.Difference.X = App.Calculate.Sub(Coordinate.X , Option.Custom.Coordinate.X);
					Option.Custom.Difference.Y = App.Calculate.Sub(Coordinate.Y , Option.Custom.Coordinate.Y);
					const Orientation = Direction(Option.Custom.Difference);
					if(App.Verify.Eq(Orientation , 0)) Option.Move.Top(App.$(Event.currentTarget) , Option.Custom.Difference , Event);
					if(App.Verify.Eq(Orientation , 1)) Option.Move.Right(App.$(Event.currentTarget) , Option.Custom.Difference , Event);
					if(App.Verify.Eq(Orientation , 2)) Option.Move.Bottom(App.$(Event.currentTarget) , Option.Custom.Difference , Event);
					if(App.Verify.Eq(Orientation , 3)) Option.Move.Left(App.$(Event.currentTarget) , Option.Custom.Difference , Event);
					Option.Move.Drag(App.$(Event.currentTarget) , Coordinate , Event);
				});
			});
			Target.bind('mouseup' , Event => {
				if(Option.Prevent) Event.preventDefault();
				const Coordinate = {};
				Coordinate.X = App.Number.Floor(Event.originalEvent.pageX);
				Coordinate.Y = App.Number.Floor(Event.originalEvent.pageY);
				Option.Custom.Difference.X = App.Calculate.Sub(Coordinate.X , Option.Custom.Coordinate.X);
				Option.Custom.Difference.Y = App.Calculate.Sub(Coordinate.Y , Option.Custom.Coordinate.Y);
				if(!Option.Custom.Double) Option.Up(App.$(Event.currentTarget) , Coordinate , Event);
				if(App.Verify.Elt(App.Number.Abs(Option.Custom.Difference.X) , 10) && App.Verify.Elt(App.Number.Abs(Option.Custom.Difference.Y) , 10)){
					Option.Custom.Time = App.Calculate.Sub(App.Date.Microtime() , Option.Custom.Time);
					if(App.Verify.Gt(Option.Custom.Time , 500)){
						Option.Hold(App.$(Event.currentTarget) , Coordinate , Event);
					}else if(Option.Custom.Double){
						Option.Custom.Double = false;
						clearTimeout(Option.Custom.Timeout);
						Option.Double(App.$(Event.currentTarget) , Coordinate , Event);
					}else{
						Option.Custom.Double = true;
						Option.Custom.Timeout = App.Util.Timeout(() => {
							Option.Custom.Double = false;
							Option.Tap(App.$(Event.currentTarget) , Coordinate , Event);
						} , 0.2);
					}
				}else{
					const Orientation = Direction(Option.Custom.Difference);
					if(App.Verify.Eq(Orientation , 0)) Option.Top(App.$(Event.currentTarget) , Coordinate , Event);
					if(App.Verify.Eq(Orientation , 1)) Option.Right(App.$(Event.currentTarget) , Coordinate , Event);
					if(App.Verify.Eq(Orientation , 2)) Option.Bottom(App.$(Event.currentTarget) , Coordinate , Event);
					if(App.Verify.Eq(Orientation , 3)) Option.Left(App.$(Event.currentTarget) , Coordinate , Event);
				}
				Target.unbind('mousemove');
			});
			Target.bind('mouseleave' , Event => {
				if(Option.Prevent) Event.preventDefault();
				Target.unbind('mousemove');
			});
		}
		Touch(...Afferent){
			let [Target , Option] = Afferent;
			if(!App.Verify.Object(Option)) Option = {};
			if(!App.Verify.Boolean(Option.Prevent)) Option.Prevent = true;
			if(!App.Verify.Function(Option.Tap)) Option.Tap = () => {};
			if(!App.Verify.Function(Option.Double)) Option.Double = () => {};
			if(!App.Verify.Function(Option.Hold)) Option.Hold = () => {};
			if(!App.Verify.Function(Option.Up)) Option.Up = () => {};
			if(!App.Verify.Function(Option.Down)) Option.Down = () => {};
			if(!App.Verify.Function(Option.Top)) Option.Top = () => {};
			if(!App.Verify.Function(Option.Bottom)) Option.Bottom = () => {};
			if(!App.Verify.Function(Option.Left)) Option.Left = () => {};
			if(!App.Verify.Function(Option.Right)) Option.Right = () => {};
			if(!App.Verify.Object(Option.Move)) Option.Move = {};
			if(!App.Verify.Function(Option.Move.Top)) Option.Move.Top = () => {};
			if(!App.Verify.Function(Option.Move.Bottom)) Option.Move.Bottom = () => {};
			if(!App.Verify.Function(Option.Move.Left)) Option.Move.Left = () => {};
			if(!App.Verify.Function(Option.Move.Right)) Option.Move.Right = () => {};
			if(!App.Verify.Function(Option.Move.Drag)) Option.Move.Drag = () => {};
			Option.Custom = {};
			Option.Custom.Coordinate = {};
			Option.Custom.Coordinate.X = 0;
			Option.Custom.Coordinate.Y = 0;
			Option.Custom.Difference = {};
			Option.Custom.Difference.X = 0;
			Option.Custom.Difference.Y = 0;
			Option.Custom.Double = false;
			Option.Custom.Time = 0;
			Option.Custom.Timeout = 0;
			Target.addEventListener('touchstart' , Event => {
				if(Option.Prevent && Event.cancelable) Event.preventDefault();
				Option.Custom.Time = App.Date.Microtime();
				Option.Custom.Coordinate.X = App.Number.Floor(Event.changedTouches[0].pageX);
				Option.Custom.Coordinate.Y = App.Number.Floor(Event.changedTouches[0].pageY);
				if(!Option.Custom.Double) Option.Down(App.$(Target) , Option.Custom.Coordinate , Event);
			});
			Target.addEventListener('touchmove' , Event => {
				if(Option.Prevent && Event.cancelable) Event.preventDefault();
				const Coordinate = {};
				Coordinate.X = App.Number.Floor(Event.changedTouches[0].pageX);
				Coordinate.Y = App.Number.Floor(Event.changedTouches[0].pageY);
				Option.Custom.Difference.X = App.Calculate.Sub(Coordinate.X , Option.Custom.Coordinate.X);
				Option.Custom.Difference.Y = App.Calculate.Sub(Coordinate.Y , Option.Custom.Coordinate.Y);
				const Orientation = Direction(Option.Custom.Difference);
				if(App.Verify.Eq(Orientation , 0)) Option.Move.Top(App.$(Target) , Option.Custom.Difference , Event);
				if(App.Verify.Eq(Orientation , 1)) Option.Move.Right(App.$(Target) , Option.Custom.Difference , Event);
				if(App.Verify.Eq(Orientation , 2)) Option.Move.Bottom(App.$(Target) , Option.Custom.Difference , Event);
				if(App.Verify.Eq(Orientation , 3)) Option.Move.Left(App.$(Target) , Option.Custom.Difference , Event);
				Option.Move.Drag(App.$(Target) , Coordinate , Event);
			});
			Target.addEventListener('touchend' , Event => {
				if(Option.Prevent && Event.cancelable) Event.preventDefault();
				const Coordinate = {};
				Coordinate.X = App.Number.Floor(Event.changedTouches[0].pageX);
				Coordinate.Y = App.Number.Floor(Event.changedTouches[0].pageY);
				Option.Custom.Difference.X = App.Calculate.Sub(Coordinate.X , Option.Custom.Coordinate.X);
				Option.Custom.Difference.Y = App.Calculate.Sub(Coordinate.Y , Option.Custom.Coordinate.Y);
				if(!Option.Custom.Double) Option.Up(App.$(Target) , Option.Custom.Coordinate , Event);
				if(App.Verify.Elt(App.Number.Abs(Option.Custom.Difference.X) , 10) && App.Verify.Elt(App.Number.Abs(Option.Custom.Difference.Y) , 10)){
					Option.Custom.Time = App.Calculate.Sub(App.Date.Microtime() , Option.Custom.Time);
					if(App.Verify.Gt(Option.Custom.Time , 500)){
						Option.Hold(App.$(Target) , Coordinate , Event);
					}else if(Option.Custom.Double){
						Option.Custom.Double = false;
						clearTimeout(Option.Custom.Timeout);
						Option.Double(App.$(Target) , Coordinate , Event);
					}else{
						Option.Custom.Double = true;
						Option.Custom.Timeout = App.Util.Timeout(() => {
							Option.Custom.Double = false;
							Option.Tap(App.$(Target) , Coordinate , Event);
						} , 0.2);
					}
				}else{
					const Orientation = Direction(Option.Custom.Difference);
					if(App.Verify.Eq(Orientation , 0)) Option.Top(App.$(Target) , Coordinate , Event);
					if(App.Verify.Eq(Orientation , 1)) Option.Right(App.$(Target) , Coordinate , Event);
					if(App.Verify.Eq(Orientation , 2)) Option.Bottom(App.$(Target) , Coordinate , Event);
					if(App.Verify.Eq(Orientation , 3)) Option.Left(App.$(Target) , Coordinate , Event);
				}
			});
		}
		Auto(...Afferent){
			if(!App.Verify.Wap()) return this.Mouse(...Afferent);
			let [Target , Option] = Afferent;
			App.Each.Loop.Add(0 , App.Util.Length(Target) , 1 , Index => {
				return this.Touch(Target[Index] , Option);
			});
		}
		Bind(...Afferent){
			const [Target , Method , Callable] = Afferent;
			Target.bind(Method , Event => {
				if(App.Verify.Function(Callable)) return Callable(App.$(Event.currentTarget) , Event);
			});
		}
		Active = {
			Tap : (...Afferent) => {
				Call(Afferent , 1);
			} ,
			Double : (...Afferent) => {
				Call(Afferent , 2);
			} ,
			Hold : (...Afferent) => {
				Call(Afferent , 3);
			} ,
			Hover : (...Afferent) => {
				const [Target , Callable] = Afferent;
				Target.hover(Event => {
					if(App.Verify.Function(Callable)) return Callable(App.$(Target));
					if(App.Verify.Object(Callable) && App.Verify.Function(Callable.Enter)) return Callable.Enter(App.$(Event.currentTarget));
				} , Event => {
					if(App.Verify.Function(Callable)) return Callable(App.$(Target));
					if(App.Verify.Object(Callable) && App.Verify.Function(Callable.Leave)) return Callable.Leave(App.$(Event.currentTarget));
				});
			} ,
		}
		Slide = {
			Top : (...Afferent) => {
				Call(Afferent , 4);
			} ,
			Right : (...Afferent) => {
				Call(Afferent , 5);
			} ,
			Bottom : (...Afferent) => {
				Call(Afferent , 6);
			} ,
			Left : (...Afferent) => {
				Call(Afferent , 7);
			} ,
		}
		Elastic = {
			Top : (...Afferent) => {
				Call(Afferent , 8);
			} ,
			Right : (...Afferent) => {
				Call(Afferent , 9);
			} ,
			Bottom : (...Afferent) => {
				Call(Afferent , 10);
			} ,
			Left : (...Afferent) => {
				Call(Afferent , 11);
			} ,
		}
		Keyboard = {
			Press : (...Afferent) => {
				const [Target , Callable] = Afferent;
				Target.bind('keypress' , Event => {
					if(App.Verify.Function(Callable)) return Callable(App.$(Event.currentTarget) , Event);
					return false;
				});
			} ,
			Up : (...Afferent) => {
				const [Target , Callable] = Afferent;
				Target.bind('keyup' , Event => {
					if(App.Verify.Function(Callable)) return Callable(App.$(Event.currentTarget) , Event);
					return false;
				});
			} ,
			Down : (...Afferent) => {
				const [Target , Callable] = Afferent;
				Target.bind('keydown' , Event => {
					if(App.Verify.Function(Callable)) return Callable(App.$(Event.currentTarget) , Event);
					return false;
				});
			} ,
			Quick : (...Afferent) => {
				let [Target , Callable , Option] = Afferent;
				if(!App.Verify.Function(Callable)) Callable = () => {};
				if(!App.Verify.Object(Option)) Option = {};
				if(!App.Verify.Number(Option.Code)) Option.Code = -1;
				if(!App.Verify.Boolean(Option.Alt)) Option.Alt = false;
				if(!App.Verify.Boolean(Option.Ctrl)) Option.Ctrl = false;
				if(!App.Verify.Boolean(Option.Shift)) Option.Shift = false;
				this.Keyboard.Press(Target , (Self , Event) => {
					if(App.Verify.Lt(Option.Code , 0)) return false;
					if(App.Verify.Confirm(Option.Alt , Event.altKey) && App.Verify.Confirm(Option.Ctrl , Event.ctrlKey) && App.Verify.Confirm(Option.Shift , Event.shiftKey) && App.Verify.Eq(Option.Code , Event.keyCode)) return Callable(Self);
				});
			} ,
		}
		Form = {
			Input : (...Afferent) => {
				const [Target , Callable] = Afferent;
				Target.bind('input' , Event => {
					if(App.Verify.Function(Callable)) return Callable(App.$(Event.currentTarget) , Event);
					return false;
				});
			} ,
			Change : (...Afferent) => {
				const [Target , Callable] = Afferent;
				Target.bind('change' , Event => {
					if(App.Verify.Function(Callable)) return Callable(App.$(Event.currentTarget) , Event);
					return false;
				});
			} ,
			Focus : (...Afferent) => {
				const [Target , Callable] = Afferent;
				Target.bind('focus' , Event => {
					if(App.Verify.Function(Callable)) return Callable(App.$(Event.currentTarget) , Event);
					return false;
				});
			} ,
			Blur : (...Afferent) => {
				const [Target , Callable] = Afferent;
				Target.bind('blur' , Event => {
					if(App.Verify.Function(Callable)) return Callable(App.$(Event.currentTarget) , Event);
					return false;
				});
			} ,
		}
	}
}