elements.OnReady(() =>
{
    elements.ItemAdd({
        id: 'dh-radio',
        render: function ()
        {
            this.Define({
                label: 'Radio',
                title: ['string'],
                name: ['string'],
                onInput: ['function']
            });

            return `
                <input type="radio" :name="name"> 
                <label for="" dh-if="title">{{ title }}</label>
            `;
        }
    })
})