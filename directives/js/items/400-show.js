directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-show',
        attribute: 'dh-show',
        order: 400,
        code: function(directive, addon, element, node, data, status, bindings)
        {
            try
            {
                const results = divhunt.Function(node.getAttribute('dh-show'), data);

                if(results)
                {
                    node.style.display = 'none';
                }
                else
                {
                    node.style.display = '';
                }

                node.removeAttribute('dh-show');
            }
            catch (error)
            {
                throw ('Invalid dh-show expression: ' + node.getAttribute('dh-show'));
            }
        }
    });
});