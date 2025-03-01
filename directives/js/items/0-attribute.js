directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-attribute',
        types: [Node.ELEMENT_NODE],
        order: 0,
        code: function(directive, addon, element, node, data, status)
        {
            Array.from(node.attributes).forEach(attribute =>
            {
                if(attribute.name.startsWith(':'))
                {
                    try
                    {
                        node.setAttribute(attribute.name.slice(1), divhunt.Function(attribute.value, data));
                    }
                    catch (e)
                    {
                        throw 'Invalid attribute "' + attribute.name + '" expression: ' + attribute.value;
                    }

                    node.removeAttribute(attribute.name);
                }
            });
        }
    });
});
