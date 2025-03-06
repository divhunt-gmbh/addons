directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-input',
        match: {
            tag: '^(input|textarea|select)$',
            attribute: {
                name: '^dh-input$'
            }
        },
        order: 500,
        code: function(context, compile, node, identifier)
        {
            const attribute = node.getAttribute('dh-input');
            node.removeAttribute('dh-input');

            const inputHandler = (event) =>
            {
                const results = divhunt.Function(attribute, context);

                if(typeof results === 'function')
                {
                    results(event);
                }
            };

            node.addEventListener('input', inputHandler);
        }
    });
});