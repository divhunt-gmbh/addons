# dh-keyup Directive Documentation

## Overview

The `dh-keyup` directive adds keyboard event handling to elements, allowing you to execute JavaScript expressions or call functions when a user releases a key while the element has focus. This provides an easy way to implement keyboard-driven interactions without writing separate event listeners.

## Syntax

```html
<element dh-keyup="expression"></element>
```

Where:
- `expression` is a JavaScript expression that will be evaluated when a key is released on the element

## Behavior

- Adds a keyup event listener to the target element
- When a key is released, evaluates the provided JavaScript expression within the current data context
- If the expression returns a function, that function is called with the keyboard event as an argument
- After setting up the event listener, the `dh-keyup` attribute is removed from the element
- The event listener remains attached even after the attribute is removed

## Examples

### Basic Key Handler

```html
<input dh-keyup="logKeyRelease()">
```

### Calling Methods

```html
<input dh-keyup="validateInput()">
```

### Passing the Event Object

```html
<input dh-keyup="handleKeyup">
```

Where `handleKeyup` is a function in your data context:

```javascript
// In your data object
const data = {
  handleKeyup: function(event) {
    // Access event properties
    console.log('Key released:', event.key);
    // Perform actions after key release
    if (event.target.value.length > 5) {
      checkAvailability(event.target.value);
    }
  }
};
```

### Detecting Specific Keys

```html
<input dh-keyup="event.key === 'Enter' ? submitForm() : null">
```

### Complex Key Combinations

```html
<textarea tabindex="0" dh-keyup="event.ctrlKey && event.key === 's' ? saveDocument() : null">
```

## Accessing Data Context

All expressions in `dh-keyup` are evaluated within the context of your data object. This means:

1. All functions must be defined on your data object
2. All variables must be properties of your data object
3. The expression has direct access to these properties without needing to use `data.` prefix because of the `with(data)` statement

## Error Handling

If the expression is invalid or cannot be evaluated, the directive will throw an error with the message:
```
Invalid dh-keyup expression: [your-expression]
```

## Implementation Details

- The directive evaluates expressions using JavaScript's `Function` constructor with a `with` statement to provide access to the data context
- The keyup event listener is added to the element before the attribute is removed, ensuring the keyboard functionality persists
- No default order priority is set, so it runs at the framework's default priority
- By default, this directive only applies to `input` and `textarea` elements

## When to Use dh-keyup vs dh-keydown

- Use `dh-keyup` when you want to respond after a key press is complete
- `dh-keyup` is ideal for validation, form submission, or actions that should happen after user input
- `dh-keyup` prevents multiple triggers when keys are held down (unlike keydown)
- For immediate response or capturing special keys like arrows before they affect the interface, use `dh-keydown` instead