directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-for',
        before: 100,
        attribute: 'dh-for',
        code: (addon, element, node, data) =>
        {
            const expression = node.getAttribute('dh-for');
            const parts = expression.split('in');

            if (parts.length < 2)
            {
                throw ('Invalid dh-for expression: ' + expression);
            }

            const expVar = parts[0].trim();
            const expArray = parts[1].trim();

            let items = [];

            try
            {
                items = new Function('data', 'with(data) { return ' + expArray + '; }')(data);
            }
            catch (e)
            {
                throw 'Invalid dh-for expression: ' + expression;
            }

            if (!Array.isArray(items))
            {
                throw 'dh-for expects an array, got: ' + typeof items;
            }

            node.removeAttribute('dh-for');

            const template = node.outerHTML;

            items.forEach((item, index) =>
            {
                data[expVar] = {v: item, i: index};
                const compiled = addon.RenderCompile(template, data);
                node.before(compiled.element);
            });

            delete data[expVar];

            node.remove();

            return {type: 'break'};
        }
    });
});