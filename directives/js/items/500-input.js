directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-input',
        attribute: 'dh-input',
        order: 500,
        tags: ['input', 'textarea'],
        code: function(directive, addon, compile, node, identifier, data, status)
        {
            const attribute = node.getAttribute('dh-input');

            node.removeAttribute('dh-input');

            const inputHandler = (event) =>
            {
                const results = divhunt.Function(attribute, data);

                if(typeof results === 'function')
                {
                    results(event, compile);
                }
            };

            if(!compile.clone)
            {
                node.addEventListener('input', inputHandler);
            }

            data.__onUnmount((node) =>
            {
                node.removeEventListener('input', inputHandler);
            }, node)
        }
    });
});