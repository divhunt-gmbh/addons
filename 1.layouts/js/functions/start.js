// Improved Layouts Positioning Function

// Helper function to check rectangle overlap
function doRectsOverlap(rect1, rect2) {
    return !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
    );
}

// Find non-overlapping vertical position
function findNonOverlappingPosition(newRect, existingElements) {
    let verticalOffset = 0;
    let overlaps;

    do {
        overlaps = existingElements.some(existingEl => {
            const existingRect = existingEl.getBoundingClientRect();
            const testRect = {
                left: newRect.left,
                right: newRect.right,
                top: newRect.top + verticalOffset,
                bottom: newRect.bottom + verticalOffset
            };
            return doRectsOverlap(testRect, existingRect);
        });

        if (overlaps) {
            verticalOffset += 20; // Increment by standard spacing
        }
    } while (overlaps);

    return verticalOffset;
}

// Comprehensive position calculation with detailed logging
function calculatePosition(value, unit, workspaceDimension) {
    // Handle null or undefined
    if (value === null || value === undefined) {
        return 0;
    }

    // If it's a percentage string
    if (typeof value === 'string' && value.endsWith('%')) {
        const percentValue = parseFloat(value);
        const calculatedPosition = (percentValue / 100) * workspaceDimension;

        return calculatedPosition;
    }

    // If it's a number or pixel value
    const parsedValue = parseFloat(value);

    return parsedValue;
}

layouts.FunctionCreate('start', function(workspace)
{
    this.workspaceRect = workspace.getBoundingClientRect();

    this.added = [];
    this.removed = [];

    this.elements = {};

    this.init = () =>
    {
        if (this.added.length)
        {
            const id = this.added[0];
            this.added.splice(0, 1);

            const item = this.addon.ItemGet(id);
            const data = item.Fn('data');

            if (item.Get('placement') === 'custom') {
                this.handleCustom(item, data);
            } else {
                this.handleSmart(item, data);
            }
        }

        if (this.removed.length)
        {
            const id = this.removed[0];

            console.log(id);
            const element = this.elements[id];

            delete this.elements[id];

            this.removed.splice(0, 1);

            console.log('Removing Element:', element);

            element.style.transition = 'opacity 350ms ease-in-out';
            element.style.opacity = '0';

            setTimeout(() =>
            {
                element.remove();
            }, 350);
        }
    };

    this.handleSmart = (item, data) => {
        console.log('Workspace Rect:', this.workspaceRect);

        // Calculate workspace dimensions
        const workspaceWidth = this.workspaceRect.width;
        const workspaceHeight = this.workspaceRect.height;

        // Calculate width and height
        const width = calculatePosition(data.width.value, data.width.unit, workspaceWidth);
        const height = calculatePosition(data.height.value, data.height.unit, workspaceHeight);

        // Calculate initial x position
        let x;
        const position = item.Get('position') || 'left';

        // Get default x position from data if available
        let xFromData = data.x
            ? calculatePosition(data.x.value, data.x.unit, workspaceWidth)
            : 20;

        switch (position) {
            case 'center':
                x = (workspaceWidth - width) / 2;
                break;
            case 'right':
                // For right positioning, we'll use the right edge of the workspace
                x = workspaceWidth - width - (data.x ? xFromData : 20);
                break;
            case 'left':
            default:
                x = xFromData;
        }

        // Calculate y position
        let y = data.y
            ? calculatePosition(data.y.value, data.y.unit, workspaceHeight)
            : 20;

        // Prepare element rectangle for overlap checking
        const newElementRect = {
            left: x,
            right: x + width,
            top: y,
            bottom: y + height
        };

        // Find non-overlapping vertical position
        const verticalOffset = findNonOverlappingPosition(newElementRect, Object.values(this.elements));

        // Adjust y position to avoid overlaps
        y += verticalOffset;

        console.log('Calculated Positioning:', { x, y, verticalOffset });

        // Prepare width and height with units
        const widthWithUnit = width + data.width.unit;
        const heightWithUnit = height + data.height.unit;

        // Create the element
        let element = item.Fn('element', widthWithUnit, heightWithUnit, x + 'px', y + 'px');

        // Handle center positioning
        if (position === 'center') {
            element.style.position = 'absolute';
            element.style.left = '0';
            element.style.right = '0';
            element.style.marginLeft = 'auto';
            element.style.marginRight = 'auto';
        }
        // Handle right positioning similar to custom
        else if (position === 'right') {
            element.style.position = 'absolute';
            element.style.right = (data.x ? xFromData : 20) + 'px';
            element.style.left = '';
            element.style.top = y + 'px';
        }

        // Initial hidden state
        element.style.opacity = '0';
        element.style.transform = 'scale(0.95)';

        workspace.appendChild(element);

        // Staggered animation
        setTimeout(() => {
            element.style.transition = 'all 350ms ease-in-out';
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        }, Object.values(this.elements).length * 50 + 50);

        this.elements[item.Get('id')] = element;
    };

    this.handleCustom = (item, data) => {
        // Calculate workspace dimensions
        const workspaceWidth = this.workspaceRect.width;
        const workspaceHeight = this.workspaceRect.height;

        // Calculate width and height
        const width = calculatePosition(data.width.value, data.width.unit, workspaceWidth);
        const height = calculatePosition(data.height.value, data.height.unit, workspaceHeight);

        // Calculate x position
        let x = calculatePosition(data.x.value, data.x.unit, workspaceWidth);
        let y = calculatePosition(data.y.value, data.y.unit, workspaceHeight);

        // Determine positioning
        const position = item.Get('position');

        // Prepare element rectangle for overlap checking
        const newElementRect = {
            left: x,
            right: x + width,
            top: y,
            bottom: y + height
        };

        // Find non-overlapping vertical position
        // const verticalOffset = findNonOverlappingPosition(newElementRect, Object.values(this.elements));
        //
        // // Adjust y position to avoid overlaps
        // y += verticalOffset;

        // Prepare width and height with units
        const widthWithUnit = width + data.width.unit;
        const heightWithUnit = height + data.height.unit;
        const xWithUnit = x + data.x.unit;
        const yWithUnit = y + data.y.unit;

        // Create the element
        let element;

        // Adjust for centering if needed
        if (position === 'center') {
            // For center, we'll modify the x calculation
            x = (workspaceWidth - width) / 2;
            element = item.Fn('element', widthWithUnit, heightWithUnit, x + 'px', yWithUnit);

            // Apply centering styles
            element.style.position = 'absolute';
            element.style.left = '0';
            element.style.right = '0';
            element.style.marginLeft = 'auto';
            element.style.marginRight = 'auto';
        } else if(position === 'right')
        {
            element = item.Fn('element', widthWithUnit, heightWithUnit, xWithUnit, yWithUnit);

            element.style.position = 'absolute';
            element.style.right = '0';
            element.style.left = '';
        }
        else
        {
            // Normal positioning
            element = item.Fn('element', widthWithUnit, heightWithUnit, xWithUnit, yWithUnit);
        }

        // Initial hidden state
        element.style.opacity = '0';
        element.style.transform = 'scale(0.95)';

        workspace.appendChild(element);

        // Staggered animation
        setTimeout(() => {
            element.style.transition = 'all 350ms ease-in-out';
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        }, Object.values(this.elements).length * 50 + 50);

        this.elements[item.Get('id')] = element;
    };

    this.start = () => {
        this.init();

        setTimeout(() => {
            this.added = this.addon.GetTemp('added', []);
            this.removed = this.addon.GetTemp('removed', []);

            this.start();
        }, 300);
    };

    this.start();
});