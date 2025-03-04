directives.OnReady(() => {
    directives.ItemAdd({
        id: 'dh-in-view',
        attribute: 'dh-in-view',
        order: 500,
        code: function(directive, addon, compile, node, identifier, data, status)
        {
            return;

            const attribute = node.getAttribute('dh-in-view');
            const repeatTrigger = node.getAttribute('dh-in-view-repeat') === 'true';
            const attrTreshold = node.getAttribute('dh-in-view-threshold');

            console.log(repeatTrigger);

            let threshold = attrTreshold;

            if(!attrTreshold)
            {
                threshold = 0;
            }

            node.removeAttribute('dh-in-view');
            node.removeAttribute('dh-in-view-repeat');
            node.removeAttribute('dh-in-view-threshold');

            const observer = new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            const results = divhunt.Function(attribute, data);

                            if (typeof results === 'function') {
                                results(entry, compile);
                            }

                            if (!repeatTrigger) {
                                observer.unobserve(entry.target);
                            }
                        }
                    });
                },
                { threshold: threshold/100 } // Adjust visibility threshold
            );

            observer.observe(node);
        }
    });
});
