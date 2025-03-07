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
                const attributes = {
                    wrapper: {},
                    data: {}
                };

                for (let i = 0; i < node.attributes.length; i++)
                {
                    const attr = node.attributes[i];

                    if (attr.name.startsWith('#'))
                    {
                        attributes.wrapper[attr.name.substring(1)] = attr.value;
                    }
                    else
                    {
                        attributes.data[attr.name] = attr.value;
                    }
                }

                console.log(attributes);

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

            const attribute = node.getAttribute('&');

            node.removeAttribute('&');

            const attributes = this.attributes(node.attributes)
            const render = this.render(attribute);


            context.Divhunt.Find(render.addon, (addon) =>
            {
                addon.Render(render.name, attributes.data, attributes.wrapper, (renderContext) =>
                {
                    node.replaceWith(renderContext.Element);
                });
            });
        }
    });
});