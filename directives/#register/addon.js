var directives = divhunt.Register('directives', (addon) =>
{
    addon.FieldAdd('attribute');
    addon.FieldAdd('types');
    addon.FieldAdd('tags');
    addon.FieldAdd('code');
    addon.FieldAdd('before');
    addon.FieldAdd('after');
    addon.FieldAdd('trigger', null, () => 'normal');

    addon.SetReload(false);
    addon.Ready(true);

    divhunt.CallbacksRegister('render_node_process', (addon, element, node, data, status) =>
    {
        directives.Fn('process', 'normal', addon, element, node, data, status);
    })

    divhunt.CallbacksRegister('render_pre_node_process', (addon, element, node, data, status) =>
    {
        directives.Fn('process', 'pre', addon, element, node, data, status);
    })

    divhunt.CallbacksRegister('render_post_node_process', (addon, element, node, data, status) =>
    {
        directives.Fn('process', 'post', addon, element, node, data, status);
    })
});