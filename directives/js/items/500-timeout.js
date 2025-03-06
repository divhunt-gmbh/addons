directives.OnReady(() => {
    directives.ItemAdd({
        id: 'dh-timeout',
        match: {
            attribute: {
                name: '^dh-timeout$'
            }
        },
        order: 500,
        code: function(context, compile, node, identifier) {

            const inlineCode = node.getAttribute('dh-timeout');
            const timeoutTime = parseInt(node.getAttribute('dh-timeout-time'), 10);

            node.removeAttribute('dh-timeout');
            node.removeAttribute('dh-timeout-time');

            const results =  new Function('context', 'compile', inlineCode);

            if(typeof results === 'function')
            {
                const timeoutID = setTimeout(() => {
                    results(context, compile);
                }, timeoutTime);

                context.OnUnmount(() => {
                    clearTimeout(timeoutID);
                });
            }
        }
    });
});