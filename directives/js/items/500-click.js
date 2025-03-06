directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-click',
        match: {
            attribute: {
                name: '^dh-click$'
            }
        },
        order: 500,
        code: function(context, compile, node, identifier)
        {
            const attribute = node.getAttribute('dh-click');
            node.removeAttribute('dh-click');
            const clickHandler = (event) =>
            {
                const results = divhunt.Function(attribute, context);

                if(typeof results === 'function')
                {
                    results(event, compile);
                }
            };

            node.addEventListener('click', clickHandler);
        }
    });
});