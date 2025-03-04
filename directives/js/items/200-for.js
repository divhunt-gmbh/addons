directives.ItemAdd({
    id: 'dh-for',
    attribute: 'dh-for',
    order: 200,
    code: function(directive, addon, compile, node, identifier, data, status)
    {
        return;
        
        const expression = node.getAttribute('dh-for');
        const match = expression.match(/(\w+)\s+in\s+(.+)/);

        if (!match)
        {
            return;
        }

        node.removeAttribute('dh-for');

        const itemName = match[1];
        const arrayExpr = match[2];

        try
        {
            const items = Function('data', `with(data) { return ${arrayExpr}; }`)(data);

            if (!Array.isArray(items))
            {
                throw(`dh-for expects an array, got: ${typeof items}`);
            }

            const content = node.outerHTML;

            items.forEach((item, index) =>
            {
                data[itemName] = {v: item, i: index};

                const compile = addon.RenderCompile(content, data);
                node.before(compile.element.firstElementChild);
            });

            node.remove();
            compile.walk = false;
        }
        catch (error)
        {
            console.error(`Error in dh-for directive:`, error);
        }
    }
});