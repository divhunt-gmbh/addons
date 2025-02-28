directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-keyup',
        attribute: 'dh-keyup',
        code: function(directive, addon, element, node, data, status)
        {
            const attribute = node.getAttribute('dh-keyup');
            const handle = (event) =>
            {
                const keyAttr = node.getAttribute('dh-keyup-key');

                if (keyAttr)
                {
                    const keys = keyAttr.split(',').map(key => key.trim());

                    if (!keys.includes(event.key))
                    {
                        return;
                    }
                }

                try
                {
                    const response = new Function('data', 'event', 'with(data) { return ' + attribute + '; }')(data, event);

                    if (typeof response === 'function')
                    {
                        response(element, event);
                    }
                }
                catch(error)
                {
                    throw('Invalid dh-keyup expression: ' + attribute);
                }
            };

            node.addEventListener('keyup', handle);
            node.removeAttribute('dh-keyup');
        }
    });
});