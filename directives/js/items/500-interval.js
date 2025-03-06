directives.OnReady(() => {
    directives.ItemAdd({
        id: 'dh-interval',
        match: {
            attribute: {
                name: '^dh-interval$'
            }
        },
        order: 500,
        code: function(context, compile, node, identifier) {

            return;

            const inlineCode = node.getAttribute('dh-interval');
            const intervalTime = parseInt(node.getAttribute('dh-interval-time'), 10);

            node.removeAttribute('dh-interval');
            node.removeAttribute('dh-interval-time');

            const results =  new Function('context', 'compile', inlineCode);

            if(typeof results === 'function')
            {
                const intervalID = setInterval(() => {
                    results(context, compile);
                }, intervalTime);

                context.OnUnmount(() => {
                    clearInterval(intervalID);
                });
            }
        }
    });
});