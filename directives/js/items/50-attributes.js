directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-attributes',
        match: {
            type: '1',
        },
        order: 50,
        code: function(context, compile, node, identifier)
        {
            const attributes = Array.from(node.attributes);

            for (const attr of attributes)
            {
                if (!attr.name.startsWith(':'))
                {
                    continue;
                }

                try
                {
                    const results = divhunt.Function(attr.value, context);
                    const attrName = attr.name.substring(1);

                    if (typeof results === 'function')
                    {
                       continue;
                    }
                    else if (['string', 'number'].includes(typeof results))
                    {
                        node.setAttribute(attrName, results);
                    }
                    else if (typeof results === 'boolean')
                    {
                        if (results)
                        {
                            node.setAttribute(attrName, '');
                        }
                        else
                        {
                            node.removeAttribute(attrName);
                        }
                    }
                    else if (results === null || results === undefined)
                    {
                        node.removeAttribute(attrName);
                    }
                    else
                    {
                        node.setAttribute(attrName, JSON.stringify(results));
                    }

                    node.removeAttribute(attr.name);
                }
                catch (error)
                {
                    console.error(`Error evaluating attribute ${attr.name}:`, error);
                }
            }
        }
    });
});