directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-keydown',
        attribute: 'dh-keydown',
        order: 400,
        trigger: 'normal',
        code: function(directive, addon, compile, node, identifier, data, status)
        {
            const attribute = node.getAttribute('dh-keydown');

            node.removeAttribute('dh-keydown');

            const keydownHandler = (event) =>
            {
                const results = divhunt.Function(attribute, data);

                if(typeof results === 'function')
                {
                    results(event, compile);
                }
            };

            node.addEventListener('keydown', keydownHandler);

            data.__onUnmount(() =>
            {
                node.removeEventListener('keydown', keydownHandler);
            })
        }
    });
});