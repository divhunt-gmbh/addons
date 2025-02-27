# dh-for Directive Documentation

## Overview

The `dh-for` directive implements list rendering, allowing you to render elements repeatedly based on an array of data. It's designed for creating dynamic lists, tables, grids, or any UI components that require iteration over collections.

## Syntax

```html
<element dh-for="item in items"></element>
```

Where:
- `item` is the variable name that will reference each individual array element
- `items` is a JavaScript expression that evaluates to an array

## Behavior

- The directive iterates over each item in the specified array
- For each iteration, it:
    1. Creates a clone of the template element
    2. Makes the current item accessible via the specified variable name
    3. Renders the clone with all its directives processed
    4. Inserts the processed clone before the original element
- The original template element is removed after all iterations
- Executes with a priority of 100 (`before: 100`), ensuring it runs before most other directives
- Returns `{type: 'break'}` to prevent further processing of the template element

## Variable Context

For each iteration, the directive creates a special context object with:
- `v`: The current item value from the array
- `i`: The current index (0-based) in the array

These are accessible through the variable name specified in the directive:

```html
<!-- Accessing the item and index -->
<li dh-for="product in products">
  {{ product.v.name }} (Item #{{ product.i + 1 }})
</li>
```

## Examples

### Basic List Rendering

```html
<ul>
  <li dh-for="user in users">{{ user.v.name }}</li>
</ul>
```

### Table Rows

```html
<table>
  <tr>
    <th>Name</th>
    <th>Email</th>
  </tr>
  <tr dh-for="contact in contactList">
    <td>{{ contact.v.name }}</td>
    <td>{{ contact.v.email }}</td>
  </tr>
</table>
```

### Combining with Other Directives

```html
<div dh-for="item in items">
  <div dh-if="item.v.isVisible">
    <h3>{{ item.v.title }}</h3>
    <button dh-show="item.v.hasActions">View Details</button>
  </div>
</div>
```

### Using the Index

```html
<div dh-for="slide in slides" class="slide" dh-show="currentSlide === slide.i">
  {{ slide.v.content }}
</div>
```

## Error Handling

The directive will throw errors in these cases:
- Invalid syntax: `Invalid dh-for expression: [your-expression]`
- Non-array result: `dh-for expects an array, got: [type]`

## Processing Order

With a `before` value of 100, `dh-for` executes before most other directives, ensuring the DOM structure is established before other directives process the generated elements.