# dh-text Directive

## Overview

The `dh-text` directive is a template interpolation mechanism that allows you to dynamically insert data values into text nodes. It uses double curly braces `{{ }}` syntax to evaluate JavaScript expressions and replace them with their corresponding values.

## Syntax

```
{{ expression }}
```

Where:
- `expression` is a JavaScript expression that will be evaluated against the current data context

## Behavior

- Targets text nodes only (Node.TYPE_NODE)
- Processes all instances of `{{ expression }}` within text content
- Automatically escapes HTML entities in string results to prevent XSS attacks
- Executes with a high priority order of 1000, ensuring it runs after structural directives
- Non-string values are inserted as-is without escaping

## Examples

### Basic Text Interpolation

```html
<p>Hello, {{ user.name }}!</p>
```

### Using Expressions

```html
<div>Total: {{ price * quantity }}</div>
```

### Conditional Text

```html
<span>Status: {{ isActive ? 'Active' : 'Inactive' }}</span>
```

### Formatting Values

```html
<p>Price: ${{ (amount).toFixed(2) }}</p>
```

## HTML Escaping

The directive automatically escapes the following characters in string results:
- `&` becomes `&amp;`
- `<` becomes `&lt;`
- `>` becomes `&gt;`
- `"` becomes `&quot;`
- `'` becomes `&#39;`

This prevents potential security issues when inserting user-generated content.

## Error Handling

If the expression is invalid or cannot be evaluated, the directive will throw an error with the message:
```
Invalid text expression: [your-expression]
```

## Processing Order

With an order value of 1000, `dh-text` typically executes after structural directives like `dh-for` (order 100) and visibility directives like `dh-show` (order 500), ensuring text interpolation happens after the DOM structure is finalized.