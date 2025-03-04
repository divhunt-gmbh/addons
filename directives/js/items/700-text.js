directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-text',
        types: [Node.TEXT_NODE],
        order: 700,
        code: function(compile, node, identifier)
        {
            this.regex = /\{\{\s*([^}]+)\s*\}\}/g;

            if (!this.regex.test(node.textContent))
            {
                return;
            }

            node.textContent = node.textContent.replace(this.regex, (match, expression) =>
            {
                let result;

                try
                {
                    result = divhunt.Function(expression, this);
                }
                catch(error)
                {
                    result = '{{' + error.message + '}}';
                }

                if(!['boolean', 'number', 'string'].includes(typeof result))
                {
                    result = '{{' + typeof result + '}}';
                }

                return result;
            });
        }
    });
});