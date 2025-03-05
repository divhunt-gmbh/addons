applications.FunctionCreate('process', function(target, load)
{
    applications.ItemGet(load, (item) =>
    {
        applications.Render(item.Get('id'), {}, (context) =>
        {
            target.appendChild(context.Element);
        })
    });
});