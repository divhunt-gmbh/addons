directives.FunctionCreate('process', function(trigger, context, compile, node, identifier)
{
    let items = this.addon.GetTemp('sorted');

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

        if (directive.Get('tags') && (node.nodeType !== Node.ELEMENT_NODE || !directive.Get('tags').includes(node.tagName.toLowerCase())))
        {
            continue;
        }

        if (directive.Get('types') && !directive.Get('types').includes(node.nodeType))
        {
            continue;
        }

        try
        {
            directive.Get('code').call({}, context, compile, node, identifier);
        }
        catch (error)
        {
            errors.Fire(error.message, 'warn');
        }
    }
});