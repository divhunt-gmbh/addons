directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-attributes',
        match: {
            type: '1',
        },
        order: 800,
        code: function(context, compile, node, identifier)
        {
            for (let i = 0; i < node.attributes.length; i++)
            {
                const attr = node.attributes[i];

                 if(attr.name.startsWith(':'))
                {
                    node.setAttribute(attr.name.substring(1), divhunt.Function(attr.value, context));
                }
            }
        }
    });
});