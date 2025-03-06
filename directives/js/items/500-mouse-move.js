directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-mouse-move',
        match: {
            attribute: {
                name: '^dh-mouse-move$'
            }
        },
        order: 500,
        code: function(context, compile, node, identifier)
        {
            const attribute = node.getAttribute('dh-mouse-move');

            node.removeAttribute('dh-mouse-move');

            const mouseEnterHandler = (event) =>
            {
                const results = divhunt.Function(attribute, context);

                if(typeof results === 'function')
                {
                    results(event, compile);
                }
            };

            node.addEventListener('mousemove', mouseEnterHandler);
        }
    });
});