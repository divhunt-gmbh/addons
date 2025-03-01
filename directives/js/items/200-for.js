directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-for',
        attribute: 'dh-for',
        order: 200,
        code: function(directive, addon, element, node, data, status, bindings)
        {
            const expression = node.getAttribute('dh-for');
            const parts = expression.split('in');

            if(!data._clones)
            {
                data._clones = [];
                data._comment_start = document.createComment('start-' + node._identifier);
                data._comment_end = document.createComment('end-' + node._identifier);

                node.before(data._comment_start);
                node.before(data._comment_end);
            }

            node.removeAttribute('dh-for');

            bindings?._register(expression, node, (identifier, compiled, newCompiled) =>
            {
                // let previousSibling = data._comment_end.previousSibling;
                //
                // console.log(previousSibling);
                //
                // while(previousSibling !== data._comment_start)
                // {
                //     previousSibling.remove();
                //     previousSibling = data._comment_end.previousSibling;
                // }
                //
                // data._clones.forEach((clone) =>
                // {
                //     data._comment_end.before(clone);
                // });
            });

            if (parts.length < 2)
            {
                throw ('Invalid dh-for expression: ' + expression);
            }

            const expVar = parts[0].trim();
            const expArray = parts[1].trim();

            try
            {
                const items = divhunt.Function(expArray, data);

                if (!Array.isArray(items))
                {
                    throw('dh-for expects an array, got: ' + typeof items);
                }

                data._clones.forEach((clone) => clone.remove() );

                items.forEach((item, index) =>
                {
                    const mergerData = {[expVar]: {v: item, i: index}};
                    const mergedData = {...data, ...mergerData};

                    const clone = addon.RenderClone(node, {todos: data.todos, [expVar]: {v: item, i: index}});

                    data._clones.push(clone.element);
                    data._comment_end.before(clone.element);
                });

                node.remove();
            }
            catch (e)
            {
                errors.Fire('Invalid dh-for expression.', 'warn', {
                    expression,
                    message: e.message,
                });
            }

            status.children = false;
        }
    });
});