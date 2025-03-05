elements.OnItemAdd((addon, item) =>
{
    elements.RenderCreate(item.Get('id'), item.Get('render'));
})