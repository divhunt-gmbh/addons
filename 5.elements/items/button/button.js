elements.OnReady(() =>
{
    elements.ItemAdd({
        id: 'dh-button',
        render: function ()
        {
            this.Define({
                label: 'Button',
                iconLeft: ['string'],
                iconRight: ['string'],
                onClick: ['function']
            });

            return `
                <div dh-bind="dh-click:alert():onClick">
                    <dh-icon name="airplane"></dh-icon>
                    <button>{{label}}</button>
                </div>
            `;
        }
    })
})