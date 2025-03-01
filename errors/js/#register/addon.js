const errors = divhunt.Register('errors', (addon) =>
{
    addon.SetReload(false);
    addon.Ready(true);

    divhunt.CallbacksRegister('error', (error) =>
    {
        console.warn(error.message);
        console.warn(error.data);
        console.log(error);
    })
});

errors.Fire = (message, type = 'warn', data = {}) =>
{
    divhunt.CallbacksRun('error', divhunt.Error(message, type, data));
};