directives.OnReady(() => {
    directives.ItemAdd({
        id: 'dh-input',
        attribute: 'dh-input',
        // tags: ['input', 'textarea'],
        code: function(directive, addon, element, node, data, status)
        {
            const handle = (event) => {
                const attribute = node.getAttribute('dh-input');

                try {
                    const response = new Function('data', 'event', 'with(data) { return ' + attribute + '; }')(data, event);

                    if (typeof response === 'function') {
                        response(event, event.target.value);
                    }
                } catch (error) {
                    throw ('Invalid dh-input expression: ' + attribute);
                }
            };

            node.addEventListener('input', handle);

        }
    });
});
