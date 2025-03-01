directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-input',
        attribute: 'dh-input',
        // tags: ['input', 'textarea'],
        order: 500,
        code: function(directive, addon, element, node, data, status, bindings)
        {
            const attribute = node.getAttribute('dh-input');

            bindings._register(attribute, node, (currentNode, newNode) =>
            {
                currentNode.replaceWith(newNode);
            });

            const handle = (event) =>
            {
                try
                {
                    const response = divhunt.Function(attribute, data);

                    if (typeof response === 'function')
                    {
                        response(event);
                    }
                }
                catch (error)
                {
                    errors.Fire('Invalid dh-input expression', 'warn', {
                        expression: attribute,
                    });
                }
            };

            node.addEventListener('input', handle);
            node.removeAttribute('dh-input');
        }
    });
});
