directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-keyup',
        attribute: 'dh-keyup',
        tags: ['input', 'textarea'],
        code: (addon, element, node, data) =>
        {
            const attribute = node.getAttribute('dh-keyup');
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
                    throw('Invalid dh-keyup expression: ' + attribute);
                }
            };

            node.addEventListener('keyup', handle);
            node.removeAttribute('dh-keyup');
        }
    });
});