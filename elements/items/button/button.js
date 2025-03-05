elements.OnReady(() =>
{
    elements.ItemAdd({
        id: 'dh-button',
        render: function ()
        {
            return `
                <dh-icon name="airplane"></dh-icon>
                <button>{{name}}</button>
            `;
        }
    })
})