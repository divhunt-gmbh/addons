elements.OnReady(() =>
{
    elements.ItemAdd({
        id: 'dh-button',
        render: function ()
        {
            this.Define({
                name: () => {
                    return {
                        id: 0
                    }
                },
            });

            return `
                <dh-icon name="airplane"></dh-icon>
                <button>{{name}}</button>
            `;
        }
    })
})