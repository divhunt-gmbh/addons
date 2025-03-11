elements.OnReady(() =>
{
    elements.ItemAdd({
        id: 'dh-checkbox',
        render: function ()
        {
            this.Define({
                label: 'Checkbox',
                title: ['string'],
                name: ['string'],
                onInput: ['function']
            });

            return `
                <input type="checkbox" :name="name"> 
                <label for="" dh-if="title">{{ title }}</label>
            `;
        }
    })
})