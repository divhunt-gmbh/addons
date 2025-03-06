directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-change',
        match: {
            tag: '^(input|textarea|select)$',
            attribute: {
                name: '^dh-change$'
            }
        },
        order: 500,
        code: function(context, compile, node, identifier)
        {
            const attribute = node.getAttribute('dh-change');
            node.removeAttribute('dh-change');

            const changeHandler = (event) =>
            {
                const results = divhunt.Function(attribute, context);

                if(typeof results === 'function')
                {
                    results(event);
                }
            };

            node.addEventListener('change', changeHandler);
        }
    });
});