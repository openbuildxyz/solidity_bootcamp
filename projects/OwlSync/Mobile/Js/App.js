export default async App => {
	App.Util.Console(App);
	if(!App.Verify.Object(App.Const)) App.Const = {};
	App.Function = (await App.Import.Js('Function')).default(App);
	if(!App.Storage.Local.Check('Language')) App.Storage.Local.Write('Language' , 'zh-cn');
	await App.Import.Css(App.String.Concat('Lang/' , App.Storage.Local.Read('Language')));
	App.Language = await App.Import.Json(App.Storage.Local.Read('Language'));
	App.Target.Section.find('> .Frame').remove();
	let Forward = 'Home';
	if(!App.Verify.Empty(App.Route.Link[0])) Forward = App.Array.Join(App.Route.Link , '/');
	if(App.Verify.Empty(App.Storage.Local.Read('Guid' , '')) && !App.Verify.Confirm(App.Route.Link[0] , 'Register')) Forward = 'Login';
	return App.Function.Forward(Forward , 'Login');
}