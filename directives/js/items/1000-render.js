directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-render',
        match: {
            type: Node.TEXT_NODE,
            text: '\\{\\{\\s*([^}]+)\\s*\\}\\}'
        },
        code: function(context, compile, node, identifier)
        {
            const bind = node.getAttribute('$');
            const name = node.getAttribute('&');

            if(bind)
            {
                if(bind in context && typeof context[bind] === 'object' && 'Element' in context[bind])
                {
                    node.replaceWith(context[bind].Element);
                    compile.children = false;
                }

                return;
            }

            const parts = name.split(':');

            let addon = 'elements';
            let render;

            if(parts.length === 1)
            {
                render = parts[0];
            }
            else if(parts.length === 2)
            {
                addon = parts[0];
                render = parts[1];
            }

            if(addon && render)
            {
                context.Divhunt.Find(addon, (addon) =>
                {
                    addon.Render(render, {}, (renderContext) =>
                    {
                        node.replaceWith(renderContext.Element);
                    });
                });
            }
        }
    });
});