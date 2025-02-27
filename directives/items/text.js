directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-text',
        order: 1000,
        types: [Node.TEXT_NODE],
        code: (addon, element, node, data) =>
        {
            const regex = /\{\{\s*([^}]+)\s*\}\}/g;

            node.textContent = node.textContent.replace(regex, (match, expression) =>
            {
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
        }
    });
});
