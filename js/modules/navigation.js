export function initNavigation() {
    const body = document.body;
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.getElementById('navMenu');
    const dropdownToggles = navMenu ? navMenu.querySelectorAll('.nav-dropdown-toggle') : [];

    if (!navToggle || !navMenu) {
        return;
    }

    const closeMenu = () => {
        navMenu.classList.remove('is-open');
        navMenu.querySelectorAll('.nav-dropdown.is-open').forEach((dropdown) => {
            dropdown.classList.remove('is-open');
            dropdown.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
        });
        body.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
    };

    navToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('is-open');
        body.classList.toggle('nav-open', isOpen);
        navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    dropdownToggles.forEach((toggle) => {
        toggle.addEventListener('click', () => {
            const dropdown = toggle.closest('.nav-dropdown');
            const isOpen = dropdown?.classList.toggle('is-open') || false;
            toggle.setAttribute('aria-expanded', String(isOpen));
        });
    });

    navMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMenu);
    });
}
