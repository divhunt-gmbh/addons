const layouts = divhunt.Register('layouts', (addon) =>
{
    addon.FieldAdd('description');
    addon.FieldAdd('spacing');
    addon.FieldAdd('render');

    addon.Ready();
});