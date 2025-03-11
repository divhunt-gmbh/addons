elements.OnReady(() =>
{
    elements.ItemAdd({
        id: 'dh-input',
        render: function ()
        {
            this.Define({
                label: 'Input',
                title: ['string'],
                type: ['string', 'text'],
                placeholder: ['string'],
                iconLeft: ['string'],
                iconRight: ['string'],
                name: ['string'],
                onInput: ['function']
            });

            return `
                <label for="" dh-if="title">{{ title }}</label>
                <div>
                    <dh-icon dh-if="iconLeft" :name="iconLeft"></dh-icon>
                    <input :type="type" :placeholder="placeholder" :name="name"> 
                    <dh-icon dh-if="iconRight" :name="iconRight"></dh-icon>
                </div>  
            `;
        }
    })
})