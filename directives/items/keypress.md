# dh-keypress Directive Documentation

## Overview

The `dh-keypress` directive adds keyboard event handling to elements, allowing you to execute JavaScript expressions or call functions when a user presses a key while the element has focus. This provides an easy way to implement keyboard-driven interactions without writing separate event listeners.

## Syntax

```html
<element dh-keypress="expression"></element>
```

Where:
- `expression` is a JavaScript expression that will be evaluated when a key is pressed on the element

## Behavior

- Adds a keydown event listener to the target element
- When a key is pressed, evaluates the provided JavaScript expression within the current data context
- If the expression returns a function, that function is called with the keyboard event as an argument
- After setting up the event listener, the `dh-keypress` attribute is removed from the element
- The event listener remains attached even after the attribute is removed

## Examples

### Basic Key Handler

```html
<input dh-keypress="logKey()">
```

### Calling Methods

```html
<input dh-keypress="processInput()">
```

### Passing the Event Object

```html
<input dh-keypress="handleKeypress">
```

Where `handleKeypress` is a function in your data context:

```javascript
// In your data object
const data = {
  handleKeypress: function(event) {
    // Access event properties
    console.log('Key pressed:', event.key);
    // Prevent default behavior if needed
    event.preventDefault();
  }
};
```

### Detecting Specific Keys

```html
<input dh-keypress="event.key === 'Enter' ? submitForm() : null">
```

### Complex Key Combinations

```html
<div tabindex="0" dh-keypress="event.ctrlKey && event.key === 's' ? saveDocument() : null">
```

## Accessing Data Context

All expressions in `dh-keypress` are evaluated within the context of your data object. This means:

1. All functions must be defined on your data object
2. All variables must be properties of your data object
3. The expression has direct access to these properties without needing to use `data.` prefix because of the `with(data)` statement

## Error Handling

If the expression is invalid or cannot be evaluated, the directive will throw an error with the message:
```
Invalid dh-keypress expression: [your-expression]
```

## Implementation Details

- The directive evaluates expressions using JavaScript's `Function` constructor with a `with` statement to provide access to the data context
- The keydown event listener is added to the element before the attribute is removed, ensuring the keyboard functionality persists
- No default order priority is set, so it runs at the framework's default priority