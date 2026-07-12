export function initNavigation() {
    const body = document.body;
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.getElementById('navMenu');

    if (!navToggle || !navMenu) {
        return;
    }

    const closeMenu = () => {
        navMenu.classList.remove('is-open');
        body.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
    };

    navToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('is-open');
        body.classList.toggle('nav-open', isOpen);
        navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMenu);
    });
}
