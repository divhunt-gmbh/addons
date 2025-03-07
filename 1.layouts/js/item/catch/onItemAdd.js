layouts.OnItemAdd(function(item)
{
    const added = this.addon.GetTemp('added', []);

    added.push(item.Get('id'));

    this.addon.SetTemp('added', added);
});