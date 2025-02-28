directives.FunctionCreate('process', function(directives, trigger, addon, element, node, data, status)
{
    const items = Object.values(directives.ItemsGet());

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
            directive.Get('code')(directive, addon, element, node, data, status);
        }
        catch (error)
        {
            console.warn('Error processing directive:', error);
        }
    }
});