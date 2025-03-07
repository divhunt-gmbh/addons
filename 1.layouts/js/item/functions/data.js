layouts.FunctionCreate('item.data', function(item)
{
    const width = divhunt.StringUnit(item.Get('width'));
    const height = divhunt.StringUnit(item.Get('height'));
    const x = divhunt.StringUnit(item.Get('x'));
    const y = divhunt.StringUnit(item.Get('y'));

    return {
        width: width,
        height: height,
        x: x,
        y: y
    };
});