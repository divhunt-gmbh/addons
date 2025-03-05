directives.OnReady(() => {
    directives.ItemAdd({
        id: 'dh-for',
        attribute: 'dh-for',
        order: 200,
        code: function(context, compile, node, identifier)
        {
            const expression = node.getAttribute('dh-for');
            const match = expression.match(/(\w+)(?:\s*,\s*(\w+))?\s+in\s+(.+)/);

            if (!match)
            {
                console.error(`Invalid dh-for syntax: ${expression}. Expected format: "item in items" or "item, index in items"`);
                return;
            }

            node.removeAttribute('dh-for');

            const itemName = match[1];
            const indexName = match[2] || `${itemName}_index`;
            const arrayExpr = match[3];

            try
            {
                let items = divhunt.Function(arrayExpr, context);

                if (!Array.isArray(items) && items && typeof items === 'object')
                {
                    if (items[Symbol.iterator])
                    {
                        items = Array.from(items);
                    }
                    else
                    {
                        items = Object.entries(items);
                    }
                }
                else if (!Array.isArray(items))
                {
                    throw(`dh-for expects an array or iterable, got: ${typeof items}`);
                }

                const html = node.outerHTML;

                items.forEach((item, index) =>
                {
                    const data = {};

                    data[itemName] = item;
                    data[indexName] = index;

                    const compile = context.Addon.RenderCompile(html, Object.assign({}, context, data));

                    node.before(compile.element);
                });

                node.remove();
                compile.children = false;
            }
            catch (error)
            {
                console.error(`Error in dh-for directive for "${expression}":`, error);
            }
        }
    });
});