# Divhunt Directives Addon

The directives addon provides a collection of HTML attributes that give you declarative control over DOM elements in the Divhunt framework. These directives allow you to manipulate the DOM, add interactivity, handle events, and conditionally render elements directly in your HTML without writing separate JavaScript functions.

## Installation

The directives addon is part of the Divhunt Framework. It's registered and initialized automatically when the framework loads.

## Available Directives

The following directives are available in the addon:

### dh-click

Adds click event handling to any element.

```html
<button dh-click="handleClick">Click me</button>
```

[Learn more about dh-click](./items/click.md)

### dh-for

Allows you to loop through arrays and render elements for each item.

```html
<div dh-for="item in items">
    {{ item.v.name }}
</div>
```

[Learn more about dh-for](./items/for.md)

### dh-if

Conditionally renders elements based on an expression.

```html
<div dh-if="isVisible">
    This element will only be displayed if isVisible is true
</div>
```

[Learn more about dh-if](./items/if.md)

### dh-input

Binds input events to handler functions.

```html
<input dh-input="handleInput">
```

### dh-keydown

Handles keydown events on input and textarea elements.

```html
<input dh-keydown="handleKeyDown">
```

### dh-keyup

Handles keyup events on input and textarea elements.

```html
<input dh-keyup="handleKeyUp">
```

[Learn more about dh-keyup](./items/keyup.md)

### dh-show

Shows or hides elements based on an expression, unlike dh-if which removes elements from the DOM.

```html
<div dh-show="isVisible">
    This element will be hidden (display: none) if isVisible is false
</div>
```

[Learn more about dh-show](./items/show.md)

### dh-text

Renders dynamic text content using double curly braces.

```html
<div>Hello, {{ username }}</div>
```

[Learn more about dh-text](./items/text.md)

### icon

A custom directive that inserts icon content.

```html
<span icon></span>
```

## How Directives Work

The directives addon processes HTML elements based on specific attributes or node types. Each directive has:

- An ID for identification
- An attribute name it responds to
- Optional type or tag restrictions
- A priority order for processing
- A code function that performs the DOM manipulation

Directives are processed in order of their specified priority, allowing more complex behaviors to be built from simpler ones.

## Expression Evaluation

Most directives evaluate JavaScript expressions within the context of a data object, allowing you to access data properties directly in your HTML. Expressions are evaluated using JavaScript's Function constructor with a data context.

## Example Usage

```html
<div>
    <h1>{{ title }}</h1>

    <button dh-click="count++">Increment</button>

    <p>Count: {{ count }}</p>

    <div dh-if="count > 5">
        Count is greater than 5!
    </div>

    <ul>
        <li dh-for="item in items">
            {{ item.v.name }}
        </li>
    </ul>
</div>
```

## Creating New Directives

Adding a new directive is straightforward:

```javascript
directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-color',
        attribute: 'dh-color',
        order: 300,
        tags: ['div', 'span'],
        code: (addon, element, node, data) =>
        {
            // Get attribute value
            const attribute = node.getAttribute('dh-color');
            
            try
            {
                // Evaluate expression with data context
                const color = new Function('data', 'with(data) { return ' + attribute + '; }')(data);
                
                // Apply the directive's effect
                node.style.color = color;
                
                // Clean up
                node.removeAttribute('dh-color');
            }
            catch(error)
            {
                throw('Invalid dh-color expression: ' + attribute);
            }
        }
    });
});
```
## Technical Details

- Directives are registered using the Divhunt addon system
- Processing order can be customized using the `order` property
- Some directives can break the processing chain with `{type: 'break'}`
- Error handling is built in to provide meaningful error messages

## Contributing

To add new directives, use the addon's ItemAdd method with the appropriate configuration.