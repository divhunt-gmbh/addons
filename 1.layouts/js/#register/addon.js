const layouts = divhunt.Register('layouts', (addon) =>
{
    addon.FieldAdd('width');
    addon.FieldAdd('height');
    addon.FieldAdd('x');
    addon.FieldAdd('y');
    addon.FieldAdd('placement');
    addon.FieldAdd('position');
    addon.FieldAdd('render');

    divhunt.CallbacksRegister('load', (target) =>
    {
    //     const render = layouts.Render('workspace', {}, {id: 'dh-workplace'});
    //
    //     target.appendChild(render.Element);
    //
    //     addon.SetTemp('workspace', render.Element);
    //     addon.Fn('start', render.Element);
    });

    addon.Ready();
});