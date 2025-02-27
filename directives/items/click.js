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

test2.RenderCreate('test', function (addon, data)
{
    data.name = 'Dejan Tomic';
    data.showH1 = true;

    data.test2 = (event) =>
    {
        console.log('TEST TEST');
    }

    data.test = (event) =>
    {
        data.showH1 = !!!data.showH1;
    };

    // setTimeout(() =>
    // {
    //     data.showH1 = false;
    // }, 1500);

    return `
        <button dh-click="test">Test</button>
        <h1 dh-if="showH1">Test</h1>
        <input type="text" dh-input="test2()">
    `;
});