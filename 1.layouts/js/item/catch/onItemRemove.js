layouts.OnItemRemove(function(item)
{
    const removed = this.addon.GetTemp('removed', []);

    removed.push(item.Get('id'));

    console.log(item.Get('id'))

    this.addon.SetTemp('removed', removed);
});