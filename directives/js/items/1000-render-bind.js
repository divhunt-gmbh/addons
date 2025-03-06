directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-render-bind',
        match: {
            tag: '^dh-render$',
            attribute: {
                name: '$'
            }
        },
        order: 1000,
        code: function(context, compile, node, identifier, matches)
        {
            return;

            const attributes = {};
            for (let i = 0; i < node.attributes.length; i++)
            {
                const attr = node.attributes[i];
                if (attr.name.startsWith('#'))
                {
                    // Remove the # prefix from the attribute name
                    const key = attr.name.substring(1);
                    attributes[key] = attr.value;
                }
            }

            // Check for bind
            const bindAttr = node.getAttribute('$');
            if (bindAttr)
            {
                if (bindAttr in context && typeof context[bindAttr] === 'object' && 'Element' in context[bindAttr])
                {
                    node.replaceWith(context[bindAttr].Element);
                    compile.children = false;
                    return;
                }
            }

            // Check for render name
            const nameAttr = node.getAttribute('&');
            if (nameAttr)
            {
                const parts = nameAttr.split(':');

                let addon = 'elements';
                let render;

                if (parts.length === 1)
                {
                    render = parts[0];
                }
                else if (parts.length === 2)
                {
                    addon = parts[0];
                    render = parts[1];
                }

                if (addon && render)
                {
                    context.Divhunt.Find(addon, (addon) =>
                    {
                        // Pass the collected attributes as the second parameter
                        addon.Render(render, attributes, {}, (renderContext) =>
                        {
                            node.replaceWith(renderContext.Element);
                        });
                    });
                }

                compile.children = false;
                return;
            }
        }
    });
});