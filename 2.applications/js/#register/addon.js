const applications = divhunt.Register('applications', (addon) =>
{
    addon.Ready(true);

    addon.FieldAdd('name');
    addon.FieldAdd('description');
    addon.FieldAdd('render');


    // divhunt.CallbacksRegister('load', (...data) => applications.Fn('process', ...data));
});