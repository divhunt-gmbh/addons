# dh-show Directive Documentation

## Overview

The `dh-show` directive is a conditional display mechanism that controls the visibility of HTML elements based on the evaluation of a JavaScript expression. When used, it either shows or hides elements by modifying their CSS `display` property.

## Syntax

```html
<element dh-show="expression"></element>
```

Where:
- `expression` is a JavaScript expression that evaluates to either truthy or falsy

## Behavior

- When the expression evaluates to `true` (truthy), the element will be displayed normally
- When the expression evaluates to `false` (falsy), the element will be hidden (display: none)
- The directive is processed with an order priority of 500
- After execution, the `dh-show` attribute is removed from the element

## Examples

### Basic Usage

```html
<!-- Button will only show if user is logged in -->
<button dh-show="isLoggedIn">Profile Settings</button>
```

### Using with Data Properties

```html
<!-- Shows element only when items array has elements -->
<div dh-show="items.length > 0">
  Items are available
</div>
```

### Combining with Other Expressions

```html
<!-- Displays message based on multiple conditions -->
<p dh-show="user.age >= 18 && user.hasPermission">
  You have access to this content
</p>
```

## Error Handling

If the expression is invalid or cannot be evaluated, the directive will throw an error with the message:
```
Invalid dh-show expression: [your-expression]
```

## Processing Order

With an order value of 500, `dh-show` executes after structural directives like `dh-for` (order 100) but at the same priority as `dh-if`.

This order ensures that elements are first created/repeated before their visibility is determined.