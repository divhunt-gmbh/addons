elements.OnItemAdd((item) =>
{
    elements.RenderCreate(item.Get('id'), item.Get('render'));
})