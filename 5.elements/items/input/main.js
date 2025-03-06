elements.OnReady(() =>
{
    elements.ItemAdd({
        id: 'dh-input',
        render: function ()
        {
            this.Define({
                label: 'Input',
                type: ['string', 'text'],
                placeholder: ['string', 'This is some text...'],
                onInput: ['function']
            });

            return `
                <input type="text" placeholder="placeholder">
            `;
        }
    })
})