directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-render-name',
        match: {
            tag: '^dh-render$',
            attribute: {
                name: '&'
            }
        },
        order: 1000,
        code: function(context, compile, node, identifier, matches)
        {
            this.attributes = () =>
            {
                const attributes = {};

                for (let i = 0; i < node.attributes.length; i++)
                {
                    const attr = node.attributes[i];

                    if (attr.name.startsWith('#'))
                    {
                        attributes[attr.name.substring(1)] = attr.value;
                    }
                }

                return attributes;
            };

            this.render = (attribute) =>
            {
                let [first, second] = attribute.split(':');

                if(!second)
                {
                    second = first;
                    first = 'elements';
                }

                return {addon: first, name: second};
            }

            const attributes = this.attributes(node.attributes)
            const render = this.render(node.getAttribute('&'));

            context.Divhunt.Find(render.addon, (addon) =>
            {
                addon.Render(render.name, {}, attributes, (renderContext) =>
                {
                    node.replaceWith(renderContext.Element);
                });
            });
        }
    });
});