layouts.FunctionCreate('item.element', function(item, width, height, x, y, index = '1')
{
    const element = document.createElement('div');

    element.classList.add('dh-layout-element');
    element.style.width = width;
    element.style.height = height;
    element.style.left = x;
    element.style.top = y;
    element.style.zIndex = index;

    return element;
});