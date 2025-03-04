directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-click',
        attribute: 'dh-click',
        order: 500,
        code: function(directive, addon, compile, node, identifier, data, status)
        {
            return;

            const attribute = node.getAttribute('dh-click');

            node.removeAttribute('dh-click');

            const clickHandler = (event) =>
            {
                const results = divhunt.Function(attribute, data);

                if(typeof results === 'function')
                {
                    results(event, compile);
                }
            };

            node.addEventListener('click', clickHandler);
        }
    });
});