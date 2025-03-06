directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-bind',
        match: {
            attribute: {
                name: '^dh-bind.*$'
            }
        },
        order: 0,
        code: function(context, compile, node, identifier, matches)
        {
            Object.entries(matches.attribute).forEach(([name, attribute]) =>
            {
                node.removeAttribute(name);

                const [bindAttribute, bindExpression, bindCondition] = attribute.value.split(':');

                if(bindAttribute && bindExpression && (!bindCondition || context[bindCondition]))
                {
                    node.setAttribute(bindAttribute, bindExpression);
                }
            });
        }
    });
});