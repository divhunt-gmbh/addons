layouts.OnReady(() => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const navbarHeight = 50;
    const sidebarWidth = 300;

    // Top Navbar
    layouts.ItemAdd({
        width: windowWidth + 'px',
        height: navbarHeight + 'px',
        x: '0%',
        y: '0%',
        placement: 'custom',
    });

    // Sidebar
    layouts.ItemAdd({
        width: sidebarWidth + 'px',
        height: (windowHeight - navbarHeight) + 'px',
        x: '0%',
        y: navbarHeight + 'px',
        placement: 'custom',
    });

    // Main Content Area
    layouts.ItemAdd({
        width: (windowWidth - sidebarWidth) + 'px',
        height: (windowHeight - navbarHeight) + 'px',
        x: sidebarWidth + 'px',
        y: navbarHeight + 'px',
        placement: 'custom',
    });
});
