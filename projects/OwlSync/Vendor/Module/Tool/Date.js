'use strict';
export default App => {
	const Determine = (...Afferent) => {
		const [Data , Default] = Afferent;
		if(App.Verify.Boolean(Data)) return Data;
		return Default;
	}
	const Pad = (...Afferent) => {
		const [Data , Double , Default] = Afferent;
		if(Determine(Double , Default)) return App.String.Pad.Start(Data , 0 , 2);
		return Data;
	}
	return new class {
		Get(Afferent){
			if(!App.Verify.Date(Afferent)) return new window.Date();
			if(App.Verify.Integer(Afferent)) Afferent = App.Number.Convert(App.String.Pad.End(Afferent , 0 , 13));
			return new window.Date(Afferent);
		}
		Time(Afferent){
			return App.Number.Convert(App.String.Substr(this.Get(Afferent).getTime() , 0 , 10));
		}
		Microtime(Afferent){
			return this.Get(Afferent).getTime();
		}
		Second(...Afferent){
			const [Data , Double] = Afferent;
			return Pad(this.Get(Data).getSeconds() , Double , true);
		}
		Minute(...Afferent){
			const [Data , Double] = Afferent;
			return Pad(this.Get(Data).getMinutes() , Double , true);
		}
		Hour(...Afferent){
			const [Data , Double] = Afferent;
			return Pad(this.Get(Data).getHours() , Double , true);
		}
		Day(...Afferent){
			const [Data , Double] = Afferent;
			return Pad(this.Get(Data).getDate() , Double , true);
		}
		Week(...Afferent){
			const [Data , Chinese] = Afferent;
			if(Determine(Chinese , true)) return App.String.Concat('星期' , ['日' , '一' , '二' , '三' , '四' , '五' , '六'][this.Get(Data).getDay()]);
			return this.Get(Data).getDay();
		}
		Month(...Afferent){
			const [Data , Double] = Afferent;
			return Pad(App.Number.Convert(App.Calculate.Add(this.Get(Data).getMonth() , 1)) , Double , true);
		}
		Year(Afferent){
			return this.Get(Afferent).getFullYear();
		}
		Today(...Afferent){
			const [Data , Double , Chinese] = Afferent;
			const Option = {};
			Option.Year = this.Year(Data);
			Option.Month = this.Month(Data , Double);
			Option.Day = this.Day(Data , Double);
			if(Determine(Chinese , false)) return App.String.Concat(Option.Year , '年' , Option.Month , '月' , Option.Day , '日');
			return App.String.Concat(Option.Year , '-' , Option.Month , '-' , Option.Day);
		}
		Clock(...Afferent){
			const [Data , Double , Chinese] = Afferent;
			const Option = {};
			Option.Hour = this.Hour(Data , Double);
			Option.Minute = this.Minute(Data , Double);
			Option.Second = this.Second(Data , Double);
			if(Determine(Chinese , false)) return App.String.Concat(Option.Hour , '时' , Option.Minute , '分' , Option.Second , '秒');
			return App.String.Concat(Option.Hour , ':' , Option.Minute , ':' , Option.Second);
		}
		Full(...Afferent){
			const [Data , Double , Chinese] = Afferent;
			const Option = {};
			Option.Year = this.Year(Data);
			Option.Month = this.Month(Data , Double);
			Option.Day = this.Day(Data , Double);
			Option.Hour = this.Hour(Data , Double);
			Option.Minute = this.Minute(Data , Double);
			Option.Second = this.Second(Data , Double);
			if(Determine(Chinese , false)) return App.String.Concat(Option.Year , '年' , Option.Month , '月' , Option.Day , '日' , Option.Hour , '时' , Option.Minute , '分' , Option.Second , '秒');
			return App.String.Concat(Option.Year , '-' , Option.Month , '-' , Option.Day , ' ' , Option.Hour , ':' , Option.Minute , ':' , Option.Second);
		}
		Before(...Afferent){
			const [Data , Target , Method] = Afferent;
			const Option = {};
			Option.Second = 1;
			Option.Minute = 60;
			Option.Hour = 3600;
			Option.Day = 86400;
			Option.Week = 604800;
			Option.Month = 2592000;
			Option.Year = 31536000;
			if(!App.Verify.Integer(Target)) Target = 0;
			if(!App.Verify.Require(Method , 'string') || !App.Verify.In(App.Object.Key(Option) , App.String.First(Method))) Method = 'Day';
			return this.Get(App.Calculate.Sub(this.Time(Data) , App.Calculate.Mul(Target , Option[App.String.First(Method)])));
		}
		After(...Afferent){
			const [Data , Target , Method] = Afferent;
			const Option = {};
			Option.Second = 1;
			Option.Minute = 60;
			Option.Hour = 3600;
			Option.Day = 86400;
			Option.Week = 604800;
			Option.Month = 2592000;
			Option.Year = 31536000;
			if(!App.Verify.Integer(Target)) Target = 0;
			if(!App.Verify.Require(Method , 'string') || !App.Verify.In(App.Object.Key(Option) , App.String.First(Method))) Method = 'Day';
			return this.Get(App.Calculate.Add(this.Time(Data) , App.Calculate.Mul(Target , Option[App.String.First(Method)])));
		}
		Friend(...Afferent){
			let [Data , English] = Afferent;
			if(!App.Verify.Boolean(English)) English = false;
			const Option = {};
			Option.Date = this.Time(Data);
			Option.Current = this.Time();
			Option.Negative = App.Verify.Elt(Option.Date , Option.Current);
			Option.Year = this.Difference.Year(Option.Current , Option.Date);
			if(App.Verify.Gt(Option.Year , 0)) return App.String.Concat(Option.Year , (English ? ' Year' : '年') , (Option.Negative ? (English ? ' Ago' : '后') : (English ? ' Latter' : '后')));
			Option.Month = this.Difference.Month(Option.Current , Option.Date);
			if(App.Verify.Gt(Option.Month , 0)) return App.String.Concat(Option.Month , (English ? ' Month' : '月') , (Option.Negative ? (English ? ' Ago' : '后') : (English ? ' Latter' : '后')));
			Option.Week = this.Difference.Week(Option.Current , Option.Date);
			if(App.Verify.Gt(Option.Week , 0)) return App.String.Concat(Option.Week , (English ? ' Week' : '周') , (Option.Negative ? (English ? ' Ago' : '后') : (English ? ' Latter' : '后')));
			Option.Day = this.Difference.Day(Option.Current , Option.Date);
			if(App.Verify.Gt(Option.Day , 0)) return App.String.Concat(Option.Day , (English ? ' Day' : '天') , (Option.Negative ? (English ? ' Ago' : '后') : (English ? ' Latter' : '后')));
			Option.Hour = this.Difference.Hour(Option.Current , Option.Date);
			if(App.Verify.Gt(Option.Hour , 0)) return App.String.Concat(Option.Hour , (English ? ' Hour' : '小时') , (Option.Negative ? (English ? ' Ago' : '后') : (English ? ' Latter' : '后')));
			Option.Minute = this.Difference.Minute(Option.Current , Option.Date);
			if(App.Verify.Gt(Option.Minute , 0)) return App.String.Concat(Option.Minute , (English ? ' Minute' : '分钟') , (Option.Negative ? (English ? ' Ago' : '后') : (English ? ' Latter' : '后')));
			Option.Second = this.Difference.Second(Option.Current , Option.Date);
			return App.String.Concat(Option.Second , (English ? ' Second' : '秒') , (Option.Negative ? (English ? ' Ago' : '后') : (English ? ' Latter' : '后')));
		}
		Difference = {
			Second : (...Afferent) => {
				const [Data , Target] = Afferent;
				return App.Number.Abs(App.Calculate.Sub(this.Time(Data) , this.Time(Target)));
			} ,
			Minute : (...Afferent) => {
				return App.Number.Floor(App.Calculate.Div(this.Difference.Second(...Afferent) , 60));
			} ,
			Hour : (...Afferent) => {
				return App.Number.Floor(App.Calculate.Div(this.Difference.Second(...Afferent) , 3600));
			} ,
			Day : (...Afferent) => {
				return App.Number.Floor(App.Calculate.Div(this.Difference.Second(...Afferent) , 86400));
			} ,
			Week : (...Afferent) => {
				return App.Number.Floor(App.Calculate.Div(this.Difference.Second(...Afferent) , 604800));
			} ,
			Month : (...Afferent) => {
				return App.Number.Floor(App.Calculate.Div(this.Difference.Second(...Afferent) , 2592000));
			} ,
			Year : (...Afferent) => {
				return App.Number.Floor(App.Calculate.Div(this.Difference.Second(...Afferent) , 31536000));
			} ,
		}
	}
}