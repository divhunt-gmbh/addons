directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-mouse-leave',
        attribute: 'dh-mouse-leave',
        order: 500,
        code: function(context, compile, node, identifier)
        {
            const attribute = node.getAttribute('dh-mouse-leave');

            node.removeAttribute('dh-mouse-leave');
            const mouseLeaveHandler = (event) =>
            {
                const results = divhunt.Function(attribute, context);

                if(typeof results === 'function')
                {
                    results(event, compile);
                }
            };

            node.addEventListener('mouseleave', mouseLeaveHandler);
        }
    });
});