directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-mouse-enter',
        attribute: 'dh-mouse-enter',
        order: 500,
        code: function(directive, addon, compile, node, identifier, data, status)
        {
            const attribute = node.getAttribute('dh-mouse-enter');

            node.removeAttribute('dh-mouse-enter');

            const mouseEnterHandler = (event) =>
            {
                const results = divhunt.Function(attribute, data);

                if(typeof results === 'function')
                {
                    results(event, compile);
                }
            };

            node.addEventListener('mouseenter', mouseEnterHandler);
        }
    });
});