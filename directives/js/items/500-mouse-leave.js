directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-mouse-leave',
        attribute: 'dh-mouse-leave',
        order: 500,
        code: function(directive, addon, compile, node, identifier, data, status)
        {
            const attribute = node.getAttribute('dh-mouse-leave');

            node.removeAttribute('dh-mouse-leave');
            const mouseLeaveHandler = (event) =>
            {
                const results = divhunt.Function(attribute, data);

                if(typeof results === 'function')
                {
                    results(event, compile);
                }
            };

            node.addEventListener('mouseleave', mouseLeaveHandler);
        }
    });
});