elements.OnReady(() =>
{
    elements.ItemAdd({
        id: 'dh-button',
        render: function ()
        {
            return `
                <dh-icon dh-if="iconLeft" name="airplane"></dh-icon>
                <button :class="class">{{name}}</button>
            `;
        }
    })
})