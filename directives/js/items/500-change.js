directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-change',
        attribute: 'dh-change',
        order: 500,
        tags: ['input', 'textarea'],
        code: function(context, compile, node, identifier)
        {
            
            const attribute = node.getAttribute('dh-change');

            node.removeAttribute('dh-change');

            const changeHandler = (event) =>
            {
                const results = divhunt.Function(attribute, context);

                if(typeof results === 'function')
                {
                    results(event, compile);
                }
            };

            node.addEventListener('change', changeHandler);

            context.OnUnmount(() =>
            {
                node.removeEventListener('change', changeHandler);
            })
        }
    });
});