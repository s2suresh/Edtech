import { ENQUIRY_ENDPOINT, ENQUIRY_SHEET_URL } from './enquiryConfig.js';

const normalizeMobile = (value) => {
    const digits = String(value || '').replace(/\D/g, '');
    return digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
};

const createReferenceId = (phone) => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const mobile = normalizeMobile(phone) || 'mobile';

    return `${day}-${month}-${year}-${mobile}`;
};

const serializeForm = (form) => {
    const formData = new FormData(form);
    const payload = {};

    formData.forEach((value, key) => {
        payload[key] = String(value).trim();
    });

    payload.sourcePage = window.location.pathname.split('/').pop() || 'index.html';
    payload.referenceId = createReferenceId(payload.phone || payload.mobile);
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

const buildWhatsappConfirmationUrl = (payload) => {
    const message = [
        'Hi Sharusuri EdTech,',
        'I submitted an admission enquiry.',
        `Reference ID: ${payload.referenceId}.`,
        `Student: ${payload.name || 'not provided'}.`,
        `Program: ${payload.program || 'not provided'}.`,
        'Please guide me for course details, payment, and next steps.',
    ].join(' ');

    return `https://wa.me/918088835686?text=${encodeURIComponent(message)}`;
};

const showSubmittedNextSteps = (formStatus, payload, name, program) => {
    formStatus.innerHTML = '';
    formStatus.append(`Thank you, ${name}. Your enquiry for ${program} has been submitted. Reference: ${payload.referenceId}. `);

    const paymentLink = document.createElement('a');
    paymentLink.href = `payment-details.html?course=${encodeURIComponent(program)}&reference=${encodeURIComponent(payload.referenceId)}`;
    paymentLink.textContent = 'View payment guidance';
    formStatus.append(paymentLink);
    formStatus.append(' | ');

    const whatsappLink = document.createElement('a');
    whatsappLink.href = buildWhatsappConfirmationUrl(payload);
    whatsappLink.target = '_blank';
    whatsappLink.rel = 'noopener noreferrer';
    whatsappLink.textContent = 'Send confirmation on WhatsApp';
    formStatus.append(whatsappLink);
};

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
                showSubmittedNextSteps(formStatus, payload, name, program);
                form.reset();
            })
            .catch(() => {
                formStatus.textContent = 'We could not submit the enquiry right now. Please try again or contact us on WhatsApp.';
            });
    });
}
