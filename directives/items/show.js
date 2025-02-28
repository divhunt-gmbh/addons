directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-show',
        attribute: 'dh-show',
        code: function(directive, addon, element, node, data, status)
        {
            try
            {
                const fn = new Function('data', 'with(data) { return ' + node.getAttribute('dh-show') + '; }');

                if (!fn(data))
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