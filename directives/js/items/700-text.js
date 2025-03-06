directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-text',
        match: {
            type: '3',
            text: '\\{\\{\\s*([^}]+)\\s*\\}\\}'
        },
        order: 700,
        code: function(context, compile, node, identifier)
        {
            node.textContent = node.textContent.replace(/\{\{\s*([^}]+)\s*\}\}/g, (match, expression) =>
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