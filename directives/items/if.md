# dh-if Directive Documentation

## Overview

The `dh-if` directive implements conditional rendering, allowing elements to be included or removed from the DOM based on the evaluation of a JavaScript expression. Unlike `dh-show` which only toggles visibility, `dh-if` completely removes elements from the DOM when the condition evaluates to false.

## Syntax

```html
<element dh-if="expression"></element>
```

Where:
- `expression` is a JavaScript expression that evaluates to either truthy or falsy

## Behavior

- When the expression evaluates to `true` (truthy), the element remains in the DOM
- When the expression evaluates to `false` (falsy), the element is completely removed from the DOM
- The directive is processed with an order priority of 500 (same as `dh-show`)
- After evaluation, the `dh-if` attribute is removed from the element if it remains in the DOM

## Examples

### Basic Usage

```html
<!-- Element only exists in DOM if user is an admin -->
<div dh-if="user.role === 'admin'">
  Admin Control Panel
</div>
```

### Using with Data Properties

```html
<!-- Error message only appears when there is an error -->
<p class="error" dh-if="errorMessage">
  {{ errorMessage }}
</p>
```

### Combining with Other Conditions

```html
<!-- Feature only available if both conditions are met -->
<section dh-if="features.newUI && user.betaTester">
  <h2>Beta Features</h2>
  <!-- Content here -->
</section>
```

## dh-if vs dh-show

- `dh-if` completely removes elements from the DOM when false
- `dh-show` only changes the CSS display property, keeping elements in the DOM
- Use `dh-if` when:
    - The condition rarely changes
    - You want to avoid initializing expensive components
    - You need to completely remove elements for accessibility or event handling
- Use `dh-show` when:
    - The condition changes frequently
    - You want to avoid the cost of re-creating DOM elements

## Error Handling

If the expression is invalid or cannot be evaluated, the directive will throw an error with the message:
```
Invalid dh-if expression: [your-expression]
```

## Processing Order

With an order value of 500, `dh-if` executes at the same priority as `dh-show` and after structural directives like `dh-for` (order 100).