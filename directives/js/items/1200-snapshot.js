directives.OnReady(() => {
    // Load html-to-image
    (function() {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/html-to-image@1.11.11/dist/html-to-image.min.js';
        document.head.appendChild(script);
    })();

    directives.ItemAdd({
        id: 'dh-snapshot',
        attribute: 'dh-snapshot',
        order: 600,
        code: function(directive, addon, compile, node, identifier, data, status) {
            node.removeAttribute('dh-snapshot');

            data.__onMount(() => {
                // Wait for library to load
                const checkLib = setInterval(() => {
                    if (window.htmlToImage) {
                        clearInterval(checkLib);
                        setTimeout(() => createSnapshot(node), 500);
                    }
                }, 100);
            });

            function createSnapshot(node) {
                // Keep it super simple - make a clone with exact same classes/styles
                const clone = node.cloneNode(true);

                // Capture original node
                htmlToImage.toPng(node, {
                    pixelRatio: 2,
                    backgroundColor: null
                })
                .then(function(dataUrl) {
                    // Create image with exact same size
                    const img = new Image();
                    img.src = dataUrl;
                    img.style.width = '100%';
                    img.style.height = '100%';
                    img.style.display = 'block';

                    // Clear the clone and insert image
                    clone.innerHTML = '';
                    clone.appendChild(img);

                    // Insert clone before original
                    node.parentNode.insertBefore(clone, node);

                    // Hide original
                    node.style.display = 'none';

                    // Super simple hover effect
                    clone.addEventListener('mouseenter', () => {
                        clone.style.display = 'none';
                        node.style.display = '';
                    });

                    node.addEventListener('mouseleave', () => {
                        node.style.display = 'none';
                        clone.style.display = '';
                    });
                })
                .catch(error => console.error('Snapshot error:', error));
            }
        }
    });
});