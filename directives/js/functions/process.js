directives.FunctionCreate('process', function(directives, trigger, addon, element, node, data, status, bindings)
{
    let items = directives.GetTemp('sorted');

    if(!items)
    {
        items = directives.SetTemp('sorted', Object.values(directives.ItemsGet()).sort((a, b) => (a.Get('order')) - (b.Get('order'))));
    }

    for (let i = 0; i < items.length; i++)
    {
        const directive = items[i];

        if(directive.Get('trigger') !== trigger)
        {
            continue;
        }

        if (directive.Get('attribute') && (node.nodeType !== Node.ELEMENT_NODE || !node.hasAttribute(directive.Get('attribute'))))
        {
            continue;
        }

        if (directive.Get('tags') && !directive.Get('tags').includes(node.tagName.toLowerCase()))
        {
            continue;
        }

        if (directive.Get('types') && !directive.Get('types').includes(node.nodeType))
        {
            continue;
        }

        try
        {
            directive.Get('code')(directive, addon, element, node, data, status, bindings);
        }
        catch (error)
        {
            errors.Fire(error.message, 'warn');
        }
    }
});