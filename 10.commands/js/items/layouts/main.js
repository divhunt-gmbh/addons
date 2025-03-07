layouts.OnReady(() =>
{
    return;
    
    layouts.ItemAdd({
        id: 'dh-command',
        description: 'A full-screen layout designed for commanding and managing features. Dive into recommended commands, perform searches, and access new commands effortlessly.',
        slots: {},
        render: function ()
        {
            this.search = '';

            this.onSearch = function(event)
            {
                console.log(event.target.value);
            }

            return `
                <div class="top">
                    <input dh-input="onSearch" value="search" placeholder="Ask me anything...">
                </div>
                
                <div class="bottom">
                    <div dh-slot="bottom"></div>
                </div>
            `;
        }
    })
});