directives.OnReady(() => {
    directives.ItemAdd({
        id: 'dh-render',
        types: [Node.ELEMENT_NODE],
        order: 1000,
        code: (directive, addon, element, node, data, status) => {
            // Skip if the tag name doesn't contain a hyphen or is a special case
            const tagName = node.tagName.toLowerCase();
            if (!tagName.includes('-') || tagName === 'dh-icon') {
                return;
            }

            // Split tag name into parts and validate
            const parts = tagName.split('-');
            if (parts.length < 2) {
                return;
            }

            // Determine addon and render name based on prefix
            const addonPrefix = parts[0];
            const renderName = parts[1];
            const renderAddon = divhunt.Find(addonPrefix === 'dh' ? 'elements' : addonPrefix);

            // Validate addon existence
            if (!renderAddon) {
                console.error(`Render addon not found for prefix "${addonPrefix}" in tag "${tagName}".`);
                return;
            }

            // Process node attributes into properties
            const properties = {};
            for (const { name, value } of node.attributes) {
                // Convert kebab-case to camelCase for attribute names
                const propName = name.includes('-')
                    ? name.split('-').map((part, idx) => idx > 0 ? part.charAt(0).toUpperCase() + part.slice(1) : part).join('')
                    : name;

                if (propName === '#') {
                    // Safer alternative to new Function: Parse as JSON or use a limited expression evaluator
                    try {
                        properties[propName] = JSON.parse(value);
                    } catch (e) {
                        console.warn(`Failed to parse JSON expression in attribute "#": ${value}. Error: ${e.message}`);
                        properties[propName] = value; // Fallback to raw value
                    }
                } else {
                    properties[propName] = value;
                }
            }

            // Perform rendering and replace node
            try {
                renderAddon.Render(renderName, properties, {}, (compiled) => {
                    if (compiled?.element) {
                        node.replaceWith(compiled.element);
                    } else {
                        console.warn(`Rendering failed for "${renderName}" - no valid element returned.`);
                    }
                });
            } catch (error) {
                console.error(`Error rendering "${renderName}" with addon "${addonPrefix}": ${error.message}`);
            }
        }
    });
});