directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-keyup',
        attribute: 'dh-keyup',
        order: 500,
        tags: ['input', 'textarea'],
        code: function(directive, addon, compile, node, identifier, data, status)
        {
            const attribute = node.getAttribute('dh-keyup');

            const keyupHandler = (event) =>
            {
                const results = divhunt.Function(attribute, data);

                if(typeof results === 'function')
                {
                    results(event, compile);
                }
            };

            node.addEventListener('keyup', keyupHandler);

            data.__onUnmount(() =>
            {
                node.removeEventListener('keyup', keyupHandler);
            })
        }
    });
});