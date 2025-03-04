directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-if',
        attribute: 'dh-if',
        order: 100,
        code: function(context, compile, node, identifier)
        {
            this.attribute = node.getAttribute('dh-if');

            if(!divhunt.Function(this.attribute, context))
            {
                compile.walk = false;
                node.remove();
            }

            node.removeAttribute('dh-if');
        }
    });
});