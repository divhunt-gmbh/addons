directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-keypress',
        attribute: 'dh-keypress',
        code: (addon, element, node, data) =>
        {
            const attribute = node.getAttribute('dh-keypress');
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
                    throw('Invalid dh-keypress expression: ' + attribute);
                }
            };

            node.addEventListener('keydown', handle)
            node.removeAttribute('dh-keypress');
        }
    });
});