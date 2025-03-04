directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-change',
        attribute: 'dh-change',
        order: 500,
        tags: ['input', 'textarea'],
        code: function(directive, addon, compile, node, identifier, data, status)
        {
            return;
            
            const attribute = node.getAttribute('dh-change');

            node.removeAttribute('dh-change');

            const changeHandler = (event) =>
            {
                const results = divhunt.Function(attribute, data);

                if(typeof results === 'function')
                {
                    results(event, compile);
                }
            };

            node.addEventListener('change', changeHandler);

            data.__onUnmount(() =>
            {
                node.removeEventListener('change', changeHandler);
            })
        }
    });
});