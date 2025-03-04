directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'phosphor-icon',
        types: [Node.ELEMENT_NODE],
        tags: ['phosphor-icon'],
        attribute: 'name',
        order: 300,
        code: function(directive, addon, element, node, data, status)
        {
            return;
            
            const name = node.getAttribute('name');
            const type = node.getAttribute('type');
            const size = node.getAttribute('size');
            const color = node.getAttribute('color');

            const iconElement = document.createElement('span');
            const styles = [];

            styles.push(`mask-image: url('https://testtest213.b-cdn.net/icons/${name}.svg')`);

            if(size)
            {
                styles.push(`width: ${size}px; height: ${size}px`);
            }

            if(color)
            {
                styles.push(`background: ${color}`);
            }

            iconElement.className = 'dh-icon';
            iconElement.style.cssText = styles.join('; ');

            Array.from(node.attributes).forEach(attribute =>
            {
                if(!['name', 'type', 'size', 'color', 'class'].includes(attribute.name))
                {
                    iconElement.setAttribute(attribute.name, attribute.value);
                }
            });

            if(node.hasAttribute('class'))
            {
                iconElement.setAttribute('class', 'dh-icon ' + node.getAttribute('class'));
            }
            else
            {
                iconElement.setAttribute('class', 'dh-icon');
            }

            node.replaceWith(iconElement);
        }
    });
});