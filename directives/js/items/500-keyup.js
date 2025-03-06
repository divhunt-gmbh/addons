directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-keyup',
        match: {
            tag: '^(input|textarea)$',
            attribute: {
                name: '^dh-keyup$'
            }
        },
        order: 500,
        code: function(context, compile, node, identifier)
        {
            const attribute = node.getAttribute('dh-keyup');
            const keyupHandler = (event) =>
            {
                const results = divhunt.Function(attribute, context);

                if(typeof results === 'function')
                {
                    results(event);
                }
            };

            node.addEventListener('keyup', keyupHandler);
        }
    });
});