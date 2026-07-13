import { ENQUIRY_ENDPOINT, ENQUIRY_SHEET_URL } from './enquiryConfig.js';

const createReferenceId = () => `SE-${new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)}`;

const serializeForm = (form) => {
    const formData = new FormData(form);
    const payload = {};

    formData.forEach((value, key) => {
        payload[key] = String(value).trim();
    });

    payload.sourcePage = window.location.pathname.split('/').pop() || 'index.html';
    payload.referenceId = createReferenceId();
    payload.submittedAt = new Date().toISOString();

    return payload;
};

const submitToEndpoint = (payload) => fetch(ENQUIRY_ENDPOINT, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
        'Content-Type': 'text/plain;charset=utf-8',
    },
    body: JSON.stringify(payload),
});

const showFallbackMessage = (formStatus, name, program) => {
    formStatus.textContent = `Thank you, ${name}. Your enquiry for ${program} has been noted. Google Sheet submission will start after the Apps Script Web App URL is configured. `;
    const sheetLink = document.createElement('a');
    sheetLink.href = ENQUIRY_SHEET_URL;
    sheetLink.target = '_blank';
    sheetLink.rel = 'noopener noreferrer';
    sheetLink.textContent = 'Response sheet';
    formStatus.append(sheetLink);
};

export function initLeadForm() {
    const form = document.getElementById('leadForm');
    const formStatus = document.getElementById('formStatus');

    if (!form || !formStatus) {
        return;
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const payload = serializeForm(form);
        const name = payload.name || 'Student';
        const program = payload.program || 'selected program';

        if (!ENQUIRY_ENDPOINT) {
            showFallbackMessage(formStatus, name, program);
            form.reset();
            return;
        }

        formStatus.textContent = 'Submitting your enquiry...';

        submitToEndpoint(payload)
            .then(() => {
                formStatus.textContent = `Thank you, ${name}. Your enquiry for ${program} has been submitted. Reference: ${payload.referenceId}`;
                form.reset();
            })
            .catch(() => {
                formStatus.textContent = 'We could not submit the enquiry right now. Please try again or contact us on WhatsApp.';
            });
    });
}
