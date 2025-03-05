const applications = divhunt.Register('applications', (addon) =>
{
    addon.FieldAdd('name');
    addon.FieldAdd('description');
    addon.FieldAdd('render');

    addon.Ready(true);

    divhunt.CallbacksRegister('load', (...data) => applications.Fn('process', ...data));
});