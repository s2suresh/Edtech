import { initLeadForm } from './modules/forms.js';
import { initLocationDropdown } from './modules/locationDropdown.js';
import { initNavigation } from './modules/navigation.js';
import { initProgramFilters } from './modules/programFilters.js';
import { initThemeToggle } from './modules/theme.js';

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initThemeToggle();
    initProgramFilters();
    initLocationDropdown();
    initLeadForm();
});
