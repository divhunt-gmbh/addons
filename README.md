# Divhunt Framework Addons

This directory contains the core directives (addons) for the Divhunt Framework. These directives provide dynamic behavior and DOM manipulation capabilities for your web applications.

## Available Directives

### dh-show
Controls the visibility of elements based on a given expression.
```html
<div dh-show="isVisible">This will only show when isVisible is true</div>
```

### dh-if
Handles conditional rendering of elements.
```html
<div dh-if="condition">This element will be rendered only if condition is true</div>
```

### dh-for
Provides iteration capabilities for rendering lists or repeated elements.
```html
<div dh-for="item in items">Repeats for each item</div>
```

### dh-click
Manages click event handling.
```html
<button dh-click="handleClick">Click Me</button>
```

### dh-text
Handles dynamic text content manipulation.
```html
<div dh-text="message">Content will be updated based on 'message' value</div>
```

## Implementation Details

Each directive is implemented as a separate module and follows a consistent pattern:

- Directives are registered using `directives.ItemAdd()`
- Each directive has a unique identifier
- Directives are processed in a specific order (defined by the `order` parameter)
- All directives are executed when the document is ready

## Usage

Directives can be used by adding the corresponding `dh-*` attribute to your HTML elements. The framework will automatically process these directives and apply the appropriate behavior based on the provided expressions.

Example:
```html
<div dh-show="isLoggedIn">
    <h1 dh-text="welcomeMessage"></h1>
    <ul>
        <li dh-for="item in menuItems">
            <a dh-click="navigate(item.url)" dh-text="item.label"></a>
        </li>
    </ul>
</div>
```

## Notes

- Expressions used in directives are evaluated in the context of your data model
- Directives are processed in order of their priority
- Invalid expressions will throw clear error messages for easier debugging
- Directives are automatically cleaned up after processing (attributes are removed)

## Contributing

When adding new directives, follow these guidelines:
1. Create a new file in the `directives/items` directory
2. Use the `directives.ItemAdd()` pattern
3. Provide proper error handling
4. Include appropriate cleanup
5. Define a sensible processing order
