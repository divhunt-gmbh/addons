applications.OnItemAdd((item) =>
{
    applications.RenderCreate(item.Get('id'), item.Get('render'));
})