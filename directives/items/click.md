# dh-click Directive Documentation

## Overview

The `dh-click` directive adds click event handling to elements, allowing you to execute JavaScript expressions or call functions when a user clicks on the element. This provides an easy way to implement interactive behavior without writing separate event listeners.

## Syntax

```html
<element dh-click="expression"></element>
```

Where:
- `expression` is a JavaScript expression that will be evaluated when the element is clicked

## Behavior

- Adds a click event listener to the target element
- When clicked, evaluates the provided JavaScript expression within the current data context
- If the expression returns a function, that function is called with the click event as an argument
- After setting up the event listener, the `dh-click` attribute is removed from the element
- The event listener remains attached even after the attribute is removed

## Examples

### Basic Click Handler

```html
<button dh-click="count++">Increment Counter</button>
```

### Calling Methods

```html
<button dh-click="saveData()">Save</button>
```

### Passing the Event Object

```html
<button dh-click="handleClick">Process Click</button>
```

Where `handleClick` is a function that will receive the click event:

```javascript
function handleClick(event) {
  // Access event properties
  console.log('Clicked at:', event.clientX, event.clientY);
  // Prevent default behavior if needed
  event.preventDefault();
}
```

### Using with Expressions

```html
<div dh-click="isActive = !isActive">Toggle Active State</div>
```

### Conditional Actions

```html
<button dh-click="isValid ? submitForm() : showError()">Submit</button>
```

## Error Handling

If the expression is invalid or cannot be evaluated, the directive will throw an error with the message:
```
Invalid dh-click expression: [your-expression]
```

## Implementation Details

- The directive evaluates expressions using JavaScript's `Function` constructor with a `with` statement to provide access to the data context
- The event listener is added to the element before the attribute is removed, ensuring the click functionality persists
- No default order priority is set, so it runs at the framework's default priority