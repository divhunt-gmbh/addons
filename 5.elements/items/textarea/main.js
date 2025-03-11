elements.OnReady(() =>
{
    elements.ItemAdd({
        id: 'dh-textarea',
        render: function ()
        {
            this.Define({
                label: 'Textarea',
                title: ['string'],
                name: ['string'],
                placeholder: ['string'],
                maxLength: ['number'],
                resize: ['boolean', 'true'],
                onInput: ['function']
            });

            return `
                <label for="" dh-if="title">{{ title }}</label>
                <textarea :placeholder="placeholder" :name="name" :maxlength="maxLength" :resize="resize"> 
            `;
        }
    })
})