var directives = divhunt.Register('directives', (addon) =>
{
    addon.FieldAdd('attribute');
    addon.FieldAdd('types');
    addon.FieldAdd('tags');
    addon.FieldAdd('code');
    addon.FieldAdd('order', null, () => 0);
    addon.FieldAdd('before');
    addon.FieldAdd('after');

    addon.SetReload(false);
    addon.Ready(true);
});






