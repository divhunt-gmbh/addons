const directives = divhunt.Register('directives', (addon) =>
{
    addon.FieldAdd('attribute');
    addon.FieldAdd('types');
    addon.FieldAdd('tags');
    addon.FieldAdd('code');
    addon.FieldAdd('trigger', null, () => 'normal');
    addon.FieldAdd('order', null, () => 0);

    addon.SetReload(false);
    addon.Ready(true);

    divhunt.CallbacksRegister('render_node_process', (addon, element, node, data, status, bindings) =>
    {
        directives.Fn('process', 'normal', addon, element, node, data, status, bindings);
    })

    divhunt.CallbacksRegister('render_pre_node_process', (addon, element, node, data, status, bindings) =>
    {
        directives.Fn('process', 'pre', addon, element, node, data, status, bindings);
    })

    divhunt.CallbacksRegister('render_post_node_process', (addon, element, node, data, status, bindings) =>
    {
        directives.Fn('process', 'post', addon, element, node, data, status, bindings);
    })
});