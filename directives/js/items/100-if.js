directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-if',
        attribute: 'dh-if',
        order: 100,
        code: function(directive, addon, compile, node, identifier, data, status)
        {
            return;
            
            this.attribute = node.getAttribute('dh-if');

            if(!divhunt.Function(this.attribute, data))
            {
                compile.walk = false;
                node.remove();
            }

            node.removeAttribute('dh-if');
        }
    });
});