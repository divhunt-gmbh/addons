directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-icon',
        types: [Node.ELEMENT_NODE],
        tags: ['dh-icon'],
        attribute: 'name',
        order: 300,
        code: function(context, compile, node, identifier)
        {
            const name = node.getAttribute('name');
            const type = node.getAttribute('type') || 'regular';
            const size = node.getAttribute('size');
            const color = node.getAttribute('color');

            const icon = document.createElement('span');
            const styles = [];

            styles.push(`mask-image: url('https://testtest213.b-cdn.net/icon/${type}/${name}${type === 'regular' ? '' : ('-' + type)}.svg')`);

            if(size)
            {
                styles.push(`width: ${size}px; height: ${size}px`);
            }

            if(color)
            {
                styles.push(`background-color: ${color}`);
            }

            icon.classList.add('dh-icon');

            if(node.hasAttribute('class'))
            {
                node.getAttribute('class').split(/\s+/).forEach(className =>
                {
                    if (className) icon.classList.add(className);
                });
            }

            Array.from(node.attributes).forEach(attribute =>
            {
                if(!['name', 'type', 'size', 'color', 'class'].includes(attribute.name))
                {
                    icon.setAttribute(attribute.name, attribute.value);
                }
            });

            icon.style.cssText = styles.join('; ');

            node.replaceWith(icon);
        }
    });
});