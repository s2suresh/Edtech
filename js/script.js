import { initLeadForm } from './modules/forms.js';
import { initLocationDropdown } from './modules/locationDropdown.js';
import { initNavigation } from './modules/navigation.js';
import { initPaymentFlow } from './modules/paymentFlow.js';
import { initProgramFilters } from './modules/programFilters.js';
import { initStudentPortal } from './modules/studentPortal.js';
import { initThemeToggle } from './modules/theme.js';

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initThemeToggle();
    initProgramFilters();
    initLocationDropdown();
    initLeadForm();
    initPaymentFlow();
    initStudentPortal();
});
