directives.OnReady(() =>
{
    directives.ItemAdd({
        attribute: 'dh-if', code: function (directive, addon, element, node, data, status, bindings)
        {
            const attribute = node.getAttribute('dh-if');

            // bindings?._register(attribute, node, (identifier, compiled, newCompiled) =>
            // {
            //     compiled.nodes[identifier].replaceWith(newCompiled.nodes[identifier]);
            //     compiled.nodes[identifier] = newCompiled.nodes[identifier];
            // });

            try
            {
                const results = divhunt.Function(attribute, data);

                if (!results)
                {
                    node.remove();
                }

                node.removeAttribute('dh-if');
            }
            catch (error)
            {
                errors.Fire('Invalid dh-if expression', 'warn', {
                    expression: node.getAttribute('dh-if'),
                });
            }
        }, id: 'dh-if', order: 100
    });
});