directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-text',
        types: [Node.TEXT_NODE],
        order: 700,
        code: function(directive, addon, compile, node, identifier, data, status)
        {
            this.regex = /\{\{\s*([^}]+)\s*\}\}/g;

            if(!node.textContent.includes('{{'))
            {
                return;
            }

            this.replace = (node, newNode) =>
            {
                node.textContent = newNode.textContent.replace(this.regex, (match, expression) =>
                {
                    let result;

                    try
                    {
                        result = divhunt.Function(expression, data);
                    }
                    catch(error)
                    {
                        result = '{{' + error.message + '}}';
                    }

                    if(['boolean', 'number', 'string'].includes(typeof result))
                    {
                        return result;
                    }

                    return JSON.stringify(result);

                });
            };

            this.handleReactive = (key, value, compiled, newCompiled) =>
            {
                if(!divhunt.StringMatch(newCompiled.nodes[identifier]?.textContent, key))
                {
                    return;
                }

                this.replace(node, newCompiled.nodes[identifier]);
            };

            this.handleCompile = (compile) =>
            {
                if(!compile.clone)
                {
                    this.replace(node, compile.nodes[identifier]);
                }
            };

            data.__onReactive(this.handleReactive);
            data.__onCompile(this.handleCompile);
        }
    });
});
