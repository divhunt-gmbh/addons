directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-if',
        match: {
            attribute: {
                name: '^dh-if$'
            }
        },
        order: 100,
        code: function(context, compile, node, identifier)
        {
            this.attribute = node.getAttribute('dh-if');
            node.removeAttribute('dh-if');

            if(!divhunt.Function(this.attribute, context))
            {
                compile.walk = false;
                node.remove();
            }
        }
    });
});