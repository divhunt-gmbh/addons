elements.OnReady(() =>
{
    elements.ItemAdd({
        id: 'dh-button',
        render: function ()
        {
            this.Define({
                label: 'Button',
                iconLeft: ['string', 'airplane'],
                iconRight: ['string', 'airplane'],
                onClick: ['function']
            });

            return `
                <dh-icon dh-if="iconLeft" name="airplane"></dh-icon>
                <button>{{label}}</button>
                <dh-icon dh-if="iconRight" name="airplane"></dh-icon>
            `;
        }
    })
})