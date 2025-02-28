directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-keydown',
        attribute: 'dh-keydown',
        tags: ['input', 'textarea'],
        code: function(directive, addon, element, node, data, status)
        {
            const attribute = node.getAttribute('dh-keydown');
            const handle = (event) =>
            {
                try
                {
                    const response = new Function('data', 'with(data) { return ' + attribute + '; }')(data);

                    if(typeof response === 'function')
                    {
                        response(event);
                    }
                }
                catch(error)
                {
                    throw('Invalid dh-keydown expression: ' + attribute);
                }
            };

            node.addEventListener('keydown', handle);
            node.removeAttribute('dh-keydown');
        }
    });
});