directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-render',
        types: [Node.ELEMENT_NODE],
        code: function(directive, addon, element, node, data, status)
        {
            if (!node.tagName.includes('-'))
            {
                return;
            }

            const parts = node.tagName.toLowerCase().split('-');

            if (parts.length < 2)
            {
                return;
            }

            const renderAddon = divhunt.Find(parts[0] === 'dh' ? 'elements' : parts[0]);
            const renderName = parts[1];

            if (!renderAddon)
            {
                throw('Addon "' + addon + '" not found.');
            }

            let properties = {};

            Array.from(node.attributes).forEach(attr =>
            {
                const attrName = attr.name.includes('-') ? attr.name.split('-').map(part => part.charAt(0).toUpperCase() + part.substring(1)).join('') : attr.name;

                if (attrName === '#' || attrName.startsWith(':'))
                {
                    try
                    {
                        if (attrName === '#')
                        {
                            properties = new Function('data', 'with(data) { return ' + attr.value + '; }')(data);
                        }
                        else
                        {
                            properties[attrName.substring(1)] = new Function('data', 'with(data) { return ' + attr.value + '; }')(data);
                        }
                    }
                    catch (e)
                    {
                        throw 'Invalid attribute "' +attrName + '" expression: ' + attr.value;
                    }
                }
                else
                {
                    properties[attrName] = attr.value;
                }
            });

            renderAddon.Render(renderName, properties, {}, function(compiled)
            {
                node.replaceWith(compiled.element);
            });
        }
    });
});