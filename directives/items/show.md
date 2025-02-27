# dh-show Directive Documentation

## Overview

The `dh-show` directive controls the visibility of HTML elements based on the evaluation of a JavaScript expression. It toggles the element's visibility by manipulating its CSS `display` property, without removing the element from the DOM.

## Syntax

```html
<element dh-show="expression"></element>
```

Where:
- `expression` is a JavaScript expression that evaluates to either truthy or falsy

## Behavior

- When the expression evaluates to `true` (truthy), the element will be displayed normally (display: '')
- When the expression evaluates to `false` (falsy), the element will be hidden (display: none)
- The directive is processed with an order priority of 500
- After execution, the `dh-show` attribute is removed from the element
- The element remains in the DOM regardless of the condition result

## Examples

### Basic Usage

```html
<!-- Menu will only be visible when menuIsOpen is true -->
<nav dh-show="menuIsOpen">
  <!-- Menu items -->
</nav>
```

### Using with Data Properties

```html
<!-- Shows warning only when threshold is exceeded -->
<div class="warning" dh-show="value > threshold">
  Warning: Value exceeds threshold!
</div>
```

### Toggling UI Elements

```html
<!-- Toggle between showing different panels -->
<div dh-show="activeTab === 'profile'">Profile Content</div>
<div dh-show="activeTab === 'settings'">Settings Content</div>
```

## dh-show vs dh-if

- `dh-show` only toggles CSS display property, keeping elements in the DOM
- `dh-if` completely removes elements from the DOM when false
- Use `dh-show` when:
    - The condition changes frequently
    - You want to maintain the element's state
    - Initial render performance is less critical than toggle performance
- Use `dh-if` when:
    - The element is rarely shown
    - You want to avoid initializing expensive components
    - DOM size and memory usage are concerns

## Error Handling

If the expression is invalid or cannot be evaluated, the directive will throw an error with the message:
```
Invalid dh-show expression: [your-expression]
```

## Processing Order

With an order value of 500, `dh-show` executes at the same priority as `dh-if` and after structural directives like `dh-for` (order 100).

## Implementation Notes

The directive sets the element's `style.display` to an empty string (`''`) when shown, which keeps the element's default display behavior rather than forcing a specific display type.