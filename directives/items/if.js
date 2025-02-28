directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-if',
        attribute: 'dh-if',
        code: function(directive, addon, element, node, data, status)
        {
            try
            {
                const fn = new Function('data', 'with(data) { return ' + node.getAttribute('dh-if') + '; }');

                if(!fn(data))
                {
                    node.remove();
                }

                node.removeAttribute('dh-if');
            }
            catch(error)
            {
                throw('Invalid dh-if expression: ' + node.getAttribute('dh-if'));
            }
        }
    });
});