directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-click',
        attribute: 'dh-click',
        code: function(addon, element, node, data)
        {
            const attribute = node.getAttribute('dh-click');
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
                    throw('Invalid dh-click expression: ' + attribute);
                }
            };

            node.addEventListener('click', handle)
            node.removeAttribute('dh-click');
        }
    });
});