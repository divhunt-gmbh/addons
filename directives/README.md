# Directive Items Documentation

This documentation focuses on the **Directive Items** provided by the module and explains how to add new items. Directive items are the core building blocks used to extend the DivHunt framework with custom behaviors by associating specific HTML attributes with processing code.

---

## Overview

The module registers a set of directive items using the `directives.ItemAdd` method. Each item is associated with a unique attribute and processing code that runs when an element with that attribute is found in the DOM. These items allow you to:

- **Conditionally render elements:** e.g., `dh-show`, `dh-if`
- **Handle events:** e.g., `dh-click`, `dh-input`
- **Iterate over data arrays:** e.g., `dh-for`
- **Interpolate text:** e.g., `dh-text`
- **Inject static content:** e.g., `icon`

The directives are registered after the module is initialized via a `directives.OnReady` callback.

---

## Directive Item Structure

Each directive item is an object with several key properties that define its behavior. Here are the main properties used:

- **`id`**  
  A unique identifier for the directive item.

- **`attribute`**  
  The HTML attribute that triggers this directive on an element (e.g., `dh-show`, `dh-click`).

- **`types`** (optional)  
  An array of node types that this directive applies to (for example, `[Node.TEXT_NODE]` for text interpolation).

- **`tags`** (optional)  
  A list of HTML tag names to which the directive is restricted.

- **`code`**  
  The function that is executed when the directive is processed. This function receives the following parameters:
    - `addon`: The addon object containing helper functions.
    - `element`: The current DOM element.
    - `node`: The node on which the directive is defined.
    - `data`: The current data context.

- **`order`** (optional)  
  A numerical value that determines the directive's processing priority. Lower numbers are processed first.

- **`before` / `after`** (optional)  
  These properties can be used to fine-tune the execution order relative to other directives.

---

## How to Add a New Directive Item

To add a new directive item to the module, follow these steps:

1. **Wait for the Directives Module to Be Ready**  
   Ensure that the directives system is fully initialized by wrapping your registration code inside a `directives.OnReady()` callback.

2. **Define the Directive Item**  
   Create an object with the required properties (`id`, `attribute`, `code`, etc.) that describes your directive.

3. **Register the Item Using `ItemAdd`**  
   Call the `directives.ItemAdd()` method with your item object. This method integrates your new directive into the processing pipeline.

### Example: Adding a New `dh-example` Directive

Below is an example of how to create and add a new directive item called `dh-example`:

```javascript
directives.OnReady(() => {
    directives.ItemAdd({
        id: 'dh-example',
        attribute: 'dh-example',
        order: 250,  // Optional: determines when to process relative to others
        code: (addon, element, node, data) => {
            // Retrieve the value of the 'dh-example' attribute
            const expression = node.getAttribute('dh-example');
            
            // Evaluate the expression in the current data context
            try {
                const result = new Function('data', 'with(data) { return ' + expression + '; }')(data);
                // Perform a custom operation based on the result
                node.innerHTML = 'Result: ' + result;
            } catch (error) {
                throw ('Invalid dh-example expression: ' + expression);
            }
            // Remove the attribute after processing to avoid reprocessing
            node.removeAttribute('dh-example');
        }
    });
});
