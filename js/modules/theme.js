const STORAGE_KEY = 'sharusuri-theme';

export function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');

    if (!themeToggle) {
        return;
    }

    const savedTheme = localStorage.getItem(STORAGE_KEY);

    if (savedTheme === 'dark') {
        document.documentElement.dataset.theme = 'dark';
        themeToggle.textContent = 'Light';
    }

    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.dataset.theme === 'dark';

        if (isDark) {
            delete document.documentElement.dataset.theme;
            themeToggle.textContent = 'Dark';
            localStorage.setItem(STORAGE_KEY, 'light');
            return;
        }

        document.documentElement.dataset.theme = 'dark';
        themeToggle.textContent = 'Light';
        localStorage.setItem(STORAGE_KEY, 'dark');
    });
}
