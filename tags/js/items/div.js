tags.OnReady(() =>
{
    tags.ItemAdd({
        id: 'div',
        label: 'Div',
        description: 'Best for holding elemnets',
        code: (resolve, reject) =>
        {
            resolve({name: 'div', 'label': 'Div'});
        }
    });
});