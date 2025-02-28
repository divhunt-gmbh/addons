directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-click',
        attribute: 'dh-click',
        code: function(directive, addon, element, node, data, status)
        {
            const attribute = node.getAttribute('dh-click');
            const handle = (event) =>
            {
                try
                {
                    const response = new Function('data', 'with(data) { return ' + attribute + '; }')(data);

                    if(typeof response === 'function')
                    {
                        response(element, event);
                    }
                }
                catch(error)
                {
                    throw('Invalid dh-click expression: ' + attribute);
                }
            };

            node.addEventListener('click', handle)
            node.removeAttribute('dh-click');
        }
    });
});
