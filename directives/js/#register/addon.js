const directives = divhunt.Register('directives', (addon) =>
{
    addon.FieldAdd('attribute');
    addon.FieldAdd('types');
    addon.FieldAdd('tags');
    addon.FieldAdd('code');
    addon.FieldAdd('trigger', null, () => 'before');
    addon.FieldAdd('order', null, () => 0);

    addon.SetReload(false);
    addon.Ready(true);

    divhunt.CallbacksRegister('render_compile_node_before', (...data) =>
    {
        directives.Fn('process', 'before', ...data);
    })

    divhunt.CallbacksRegister('render_compile_node_after', (...data) =>
    {
        directives.Fn('process', 'after', ...data);
    })

    /* Children */

    divhunt.CallbacksRegister('render_compile_node_children_before', (...data) =>
    {
        directives.Fn('process', 'children_before', ...data);
    })

    divhunt.CallbacksRegister('render_compile_node_children_after', (...data) =>
    {
        directives.Fn('process', 'children_after', ...data);
    })
});