directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-id',
        attribute: 'dh-id',
        order: 1000,
        code: function(context, compile, node, identifier)
        {
            const attribute = node.getAttribute('dh-id');

            context.OnCompile(() =>
            {
                context.Set(attribute, compile.nodes[identifier]);
            });
        }
    });
});