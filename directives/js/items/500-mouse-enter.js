directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-mouse-enter',
        attribute: 'dh-mouse-enter',
        order: 500,
        code: function(context, compile, node, identifier)
        {
            const attribute = node.getAttribute('dh-mouse-enter');

            node.removeAttribute('dh-mouse-enter');

            const mouseEnterHandler = (event) =>
            {
                const results = divhunt.Function(attribute, context);

                if(typeof results === 'function')
                {
                    results(event, compile);
                }
            };

            node.addEventListener('mouseenter', mouseEnterHandler);
        }
    });
});