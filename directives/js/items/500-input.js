directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-input',
        attribute: 'dh-input',
        order: 500,
        tags: ['input', 'textarea', 'select'],
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