directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-text',
        types: [Node.TEXT_NODE],
        trigger: 'post',
        order: 700,
        code: function(directive, addon, element, node, data, status, bindings)
        {
            const regex = /\{\{\s*([^}]+)\s*\}\}/g;
            let matches = '';

            node.textContent = node.textContent.replace(regex, (match, expression) =>
            {
                matches += match;

                try
                {
                    const result = new Function('data', 'with(data) { return ' + expression + '; }')(data);

                    if(typeof result === 'string')
                    {
                        return result.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
                    }

                    return result;
                }
                catch (err)
                {
                    throw  'Invalid text expression: ' + expression;
                }
            });

            bindings?._register(matches, node, (identifier, compiled, newCompiled) =>
            {
                compiled.nodes[identifier].replaceWith(newCompiled.nodes[identifier]);
                compiled.nodes[identifier] = newCompiled.nodes[identifier];
            });
        }
    });
});
