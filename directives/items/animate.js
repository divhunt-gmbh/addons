directives.OnReady(() =>
{
    directives.ItemAdd({
        id: 'dh-animate',
        attribute: 'dh-animate',
        code: (addon, element, node, data) =>
        {
            const attribute = node.getAttribute('dh-animate');
            let animationConfig = {};

            try
            {
                // Parse the animation configuration
                animationConfig = new Function('data', 'with(data) { return ' + attribute + '; }')(data);

                if(typeof animationConfig !== 'object')
                {
                    throw('dh-animate expects an object configuration');
                }

                // Default configuration
                const config = {
                    type: animationConfig.type || 'fade', // fade, slide, zoom
                    duration: animationConfig.duration || 300,
                    delay: animationConfig.delay || 0,
                    easing: animationConfig.easing || 'ease',
                    autoStart: animationConfig.autoStart !== undefined ? animationConfig.autoStart : true,
                    onComplete: animationConfig.onComplete || null
                };

                // Store original styles to revert back if needed
                const originalDisplay = node.style.display;
                const originalVisibility = node.style.visibility;
                const originalOpacity = node.style.opacity;
                const originalHeight = node.style.height;
                const originalWidth = node.style.width;
                const originalTransform = node.style.transform;

                // Setup transition
                node.style.transition = `all ${config.duration}ms ${config.easing} ${config.delay}ms`;

                // Animation implementations
                const animations = {
                    fade: {
                        in: (element) => {
                            element.style.opacity = '0';
                            element.style.display = originalDisplay || '';
                            setTimeout(() => { element.style.opacity = '1'; }, 10);
                        },
                        out: (element) => {
                            element.style.opacity = '0';
                            setTimeout(() => {
                                element.style.display = 'none';
                            }, config.duration + config.delay);
                        }
                    },
                    slide: {
                        in: (element) => {
                            element.style.overflow = 'hidden';
                            element.style.height = '0';
                            element.style.display = originalDisplay || '';
                            setTimeout(() => {
                                element.style.height = element.scrollHeight + 'px';
                                setTimeout(() => {
                                    element.style.height = '';
                                    element.style.overflow = '';
                                }, config.duration + config.delay);
                            }, 10);
                        },
                        out: (element) => {
                            element.style.overflow = 'hidden';
                            element.style.height = element.scrollHeight + 'px';
                            setTimeout(() => {
                                element.style.height = '0';
                                setTimeout(() => {
                                    element.style.display = 'none';
                                    element.style.height = '';
                                    element.style.overflow = '';
                                }, config.duration + config.delay);
                            }, 10);
                        }
                    },
                    zoom: {
                        in: (element) => {
                            element.style.transform = 'scale(0.5)';
                            element.style.opacity = '0';
                            element.style.display = originalDisplay || '';
                            setTimeout(() => {
                                element.style.transform = 'scale(1)';
                                element.style.opacity = '1';
                            }, 10);
                        },
                        out: (element) => {
                            element.style.transform = 'scale(0.5)';
                            element.style.opacity = '0';
                            setTimeout(() => {
                                element.style.display = 'none';
                            }, config.duration + config.delay);
                        }
                    }
                };

                // Add animation methods to the element
                node.animate = {
                    in: () => {
                        if(animations[config.type] && animations[config.type].in)
                        {
                            animations[config.type].in(node);

                            if(config.onComplete)
                            {
                                setTimeout(() => {
                                    const fn = typeof config.onComplete === 'function' ?
                                        config.onComplete :
                                        new Function('data', 'with(data) { return ' + config.onComplete + '; }')(data);

                                    if(typeof fn === 'function')
                                    {
                                        fn.call(data, 'in');
                                    }
                                }, config.duration + config.delay);
                            }
                        }
                    },
                    out: () => {
                        if(animations[config.type] && animations[config.type].out)
                        {
                            animations[config.type].out(node);

                            if(config.onComplete)
                            {
                                setTimeout(() => {
                                    const fn = typeof config.onComplete === 'function' ?
                                        config.onComplete :
                                        new Function('data', 'with(data) { return ' + config.onComplete + '; }')(data);

                                    if(typeof fn === 'function')
                                    {
                                        fn.call(data, 'out');
                                    }
                                }, config.duration + config.delay);
                            }
                        }
                    },
                    toggle: () => {
                        if(node.style.display === 'none')
                        {
                            node.animate.in();
                        }
                        else
                        {
                            node.animate.out();
                        }
                    }
                };

                // Expose animation methods to data context if element has an ID
                if(node.id)
                {
                    if(!data.animations)
                    {
                        data.animations = {};
                    }

                    data.animations[node.id] = node.animate;
                }

                // Auto start animation if configured
                if(config.autoStart)
                {
                    node.animate.in();
                }

                node.removeAttribute('dh-animate');
            }
            catch(error)
            {
                throw('Invalid dh-animate expression: ' + attribute + ' - ' + error);
            }
        }
    });
});