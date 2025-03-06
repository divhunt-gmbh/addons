directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-double-click',
        match: {
            attribute: {
                name: '^dh-double-click$'
            }
        },
        order: 500,
        code: function(context, compile, node, identifier)
        {
            const attribute = node.getAttribute('dh-double-click');
            node.removeAttribute('dh-double-click');
            const doubleClickHandler = (event) =>
            {
                const results = divhunt.Function(attribute, context);

                if(typeof results === 'function')
                {
                    results(event);
                }
            };

            node.addEventListener('dblclick', doubleClickHandler);
        }
    });
});