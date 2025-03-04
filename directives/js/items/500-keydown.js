directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-keydown',
        attribute: 'dh-keydown',
        order: 400,
        code: function(context, compile, node, identifier)
        {
            const attribute = node.getAttribute('dh-keydown');
            node.removeAttribute('dh-keydown');

            const keydownHandler = (event) =>
            {
                const results = divhunt.Function(attribute, context);

                if(typeof results === 'function')
                {
                    results(event, compile);
                }
            };

            node.addEventListener('keydown', keydownHandler);

            context.OnUnmount(() =>
            {
                node.removeEventListener('keydown', keydownHandler);
            })
        }
    });
});