directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-show',
        order: 500,
        attribute: 'dh-show',
        code: (addon, element, node, data) =>
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