directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-id',
        attribute: 'dh-id',
        order: 1000,
        code: function(directive, addon, compile, node, identifier, data, status)
        {
            return;

            const attribute = node.getAttribute('dh-id');

            data.__onCompile(() =>
            {
                data.__set(attribute, compile.nodes[identifier]);
            });
        }
    });
});