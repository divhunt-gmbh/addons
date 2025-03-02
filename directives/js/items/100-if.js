directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-if',
        attribute: 'dh-if',
        order: 100,
        trigger: 'before',
        code: function(directive, addon, compile, node, identifier, data, status)
        {
            return;

            this.attribute = node.getAttribute('dh-if');
            this.comment = data.__get(identifier + '_comment');

            if(!this.attribute)
            {
                return;
            }
            node.removeAttribute('dh-if');

            if(!divhunt.Function(this.attribute, data))
            {
                status.children = false;
            }

            this.createComment = () =>
            {
                if(!this.comment)
                {
                    this.comment = document.createComment(identifier + ' dh-if');
                    data.__set(identifier + '_comment', this.comment);

                    node.after(this.comment);
                }
            }

            this.removeComment = () =>
            {
                if(this.comment)
                {
                    this.comment.remove();
                    this.comment = null;
                }
            }

            this.handleReactive = (key, value, compiled, newCompiled) =>
            {
                if(!this.attribute.includes(key))
                {
                    return;
                }

                const visible = divhunt.Function(this.attribute, data);

                if(!visible)
                {
                    this.createComment();
                    node.remove();

                    return;
                }

                if(this.comment)
                {
                    this.comment.before(newCompiled.nodes[identifier]);

                    node = newCompiled.nodes[identifier];
                    compiled.nodes[identifier] = node;

                    this.removeComment();
                }
            };

            this.handleOnMount = () =>
            {
                const visible = divhunt.Function(this.attribute, data);

                if(!visible)
                {
                    this.createComment();
                    node.remove();
                }
            };

            data.__onReactive(this.handleReactive);
            data.__onMount(this.handleOnMount);
        }
    });
});