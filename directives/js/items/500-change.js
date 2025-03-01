directives.OnReady(() => {
    directives.ItemAdd({
        id: 'dh-change',
        attribute: 'dh-change',
        // tags: ['input', 'textarea'],
        order: 500,
        code: function(directive, addon, element, node, data, status, bindings)
        {
            const attribute = node.getAttribute('dh-change');

            // bindings?._register(attribute, node, (currentNode, newNode) =>
            // {
            //     currentNode.replaceWith(newNode);
            // });

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
                    console.log(error);
                    errors.Fire('Invalid dh-change expression', 'warn', {
                        expression: attribute,
                    });
                }
            };

            node.addEventListener('change', handle);
            node.removeAttribute('dh-change');
        }
    });
});
