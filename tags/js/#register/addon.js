const tags = divhunt.Register('tags', (addon) =>
{
    addon.FieldAdd('code');
    addon.FieldAdd('label');

    addon.blocks = divhunt.Register('tags.blocks', (addon) =>
    {
        addon.FieldAdd('code');
        addon.FieldAdd('label');

        addon.Ready(true);
    })

    addon.SetReload(false);
    addon.Ready(true);
});