directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-text',
        types: [Node.TEXT_NODE],
        order: 700,
        code: function(context, compile, node, identifier)
        {
            const regex = /\{\{\s*([^}]+)\s*\}\}/g;

            if (!node.textContent.includes('{{'))
            {
                return;
            }

            if (!regex.test(node.textContent))
            {
                return;
            }

            node.textContent = node.textContent.replace(regex, (match, expression) =>
            {
                let result;

                try
                {
                    result = divhunt.Function(expression, context);

                    if (result === null)
                    {
                        result = '';
                    }
                    else if (result === undefined)
                    {
                        result = '';
                    }
                    else if (!['boolean', 'number', 'string'].includes(typeof result))
                    {
                        try
                        {
                            const stringifier = result.toString();

                            if (stringifier !== '[object Object]')
                            {
                                result = stringifier;
                            }
                            else
                            {
                                result = '{{' + typeof result + '}}';
                            }
                        }
                        catch (e)
                        {
                            result = '{{' + typeof result + '}}';
                        }
                    }
                }
                catch(error)
                {
                    result = '{{Error: ' + error.message + '}}';
                }

                return result;
            });
        }
    });
});