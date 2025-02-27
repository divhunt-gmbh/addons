# dh-animate Directive Documentation

## Overview

The `dh-animate` directive adds animation capabilities to elements, allowing you to apply entrance and exit animations with configurable options. This directive provides a simple way to create smooth transitions without requiring external libraries or complex CSS.

## Syntax

```html
<element dh-animate="animationConfig"></element>
```

Where:
- `animationConfig` is a JavaScript object with animation options

## Behavior

- Adds animation methods (`in`, `out`, and `toggle`) to the target element
- Configures CSS transitions based on the provided options
- If the element has an ID, exposes animation methods via the `animations` object in the data context
- Automatically starts the entrance animation if `autoStart` is true (default)
- After setup, the `dh-animate` attribute is removed from the element

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| type | String | 'fade' | Animation type: 'fade', 'slide', or 'zoom' |
| duration | Number | 300 | Animation duration in milliseconds |
| delay | Number | 0 | Delay before animation starts in milliseconds |
| easing | String | 'ease' | CSS transition timing function |
| autoStart | Boolean | true | Whether to automatically start the entrance animation |
| onComplete | Function | null | Callback function executed when animation completes |

## Examples

### Basic Usage

```html
<div id="notification" dh-animate="{ type: 'fade', duration: 500 }">
  This notification will fade in automatically
</div>
```

### Animation without Auto-Start

```html
<div id="modal" dh-animate="{ type: 'zoom', autoStart: false }">
  <!-- Modal content -->
</div>
```

```javascript
// Later in your code:
data.animations.modal.in(); // Show the modal with zoom animation
```

### Using the Slide Animation

```html
<div id="accordion" dh-animate="{ type: 'slide', duration: 400 }">
  Content that will slide down
</div>
```

### With Completion Callback

```html
<div id="notification" dh-animate="{ type: 'fade', onComplete: handleAnimationComplete }">
  Notification content
</div>
```

```javascript
// In your data object
const data = {
  handleAnimationComplete: function(direction) {
    console.log('Animation complete:', direction); // 'in' or 'out'
    if (direction === 'out') {
      // Clean up after element is hidden
    }
  }
};
```

### Custom Animation Settings

```html
<div id="tooltip" dh-animate="{ 
  type: 'fade', 
  duration: 200, 
  delay: 100, 
  easing: 'ease-in-out' 
}">
  Tooltip content
</div>
```

## Animation Methods

Each animated element has the following methods added to it:

### element.animate.in()
Shows the element with the configured animation.

### element.animate.out()
Hides the element with the configured animation.

### element.animate.toggle()
Toggles between showing and hiding the element with animations.

## Accessing Animations from Data Context

When an element with `dh-animate` has an ID, its animation methods are exposed through the `animations` object in the data context:

```javascript
// Show element with ID "modal"
data.animations.modal.in();

// Hide element with ID "notification"
data.animations.notification.out();

// Toggle element with ID "sidebar"
data.animations.sidebar.toggle();
```

## Animation Types

### fade
Animates the element's opacity to show or hide it.

### slide
Animates the element's height to create a sliding effect.

### zoom
Combines scaling and opacity for a zoom effect.

## Error Handling

If the animation configuration is invalid, the directive will throw an error with the message:
```
Invalid dh-animate expression: [your-expression] - [error details]
```

## Implementation Details

- The directive uses CSS transitions for smooth animations
- Original element styles are preserved and restored appropriately
- Animation timing is managed using JavaScript setTimeout
- The element's display property is set to 'none' after exit animations complete