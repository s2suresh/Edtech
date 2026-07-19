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

const COURSE_PREFILLS = {
    'basic-foundation': {
        program: 'Basic Foundation',
        studentClass: 'Basic Foundation',
        message: 'I am interested in Basic Foundation. Please share batch timing, fee options, counselling steps, and the next admission process.',
    },
    'classes-1-3': {
        program: 'Classes 1-3 Fundamentals',
        studentClass: 'Class 1',
        message: 'I am interested in Classes 1-3 Fundamentals. Please guide us on the right batch, practice plan, fee options, and counselling call.',
    },
    'competitive-4-5': {
        program: 'Classes 4-5 Competitive',
        studentClass: 'Class 4',
        message: 'I am interested in Classes 4-5 Competitive preparation for Navodaya, Morarji Desai, or other entrance support. Please share batch and test plan details.',
    },
    'classes-6-10-maths': {
        program: 'Classes 6-10 Maths',
        studentClass: 'Class 6',
        message: 'I am interested in Classes 6-10 Maths. Please share the chapter plan, weekly schedule, doubt session process, and fee options.',
    },
    'plus-one-plus-two': {
        program: '+1 and +2 Physics & Maths',
        studentClass: 'PUC 1 / Class 11',
        message: 'I am interested in +1 and +2 Physics & Maths. Please share course duration, batch timing, problem practice plan, and fee options.',
    },
};

const COURSE_PAYMENT_SLUGS = {
    'Basic Foundation': 'basic-foundation',
    'Classes 1-3 Fundamentals': 'classes-1-3',
    'Classes 4-5 Competitive': 'competitive-4-5',
    'Classes 6-10 Maths': 'classes-6-10-maths',
    '+1 and +2 Physics & Maths': 'plus-one-plus-two',
};

const normalizeCourseKey = (value) => String(value || '').trim().toLowerCase();

const setFieldValue = (form, name, value) => {
    if (!value) return;

    const field = form.elements[name];
    if (!field) return;

    field.value = value;
    field.dispatchEvent(new Event('change', { bubbles: true }));
};

const getCoursePrefill = () => {
    const params = new URLSearchParams(window.location.search);
    const courseKey = normalizeCourseKey(params.get('course'));
    const prefill = COURSE_PREFILLS[courseKey] || {};

    return {
        program: params.get('program') || prefill.program || '',
        studentClass: params.get('studentClass') || prefill.studentClass || '',
        preferredMode: params.get('mode') || '',
        message: params.get('message') || prefill.message || '',
        courseKey,
    };
};

const applyFormPrefill = (form, formStatus) => {
    const prefill = getCoursePrefill();

    setFieldValue(form, 'program', prefill.program);
    setFieldValue(form, 'studentClass', prefill.studentClass);
    setFieldValue(form, 'preferredMode', prefill.preferredMode);
    setFieldValue(form, 'message', prefill.message);

    if (prefill.program && formStatus) {
        formStatus.textContent = `${prefill.program} selected. Fill student and guardian details to request counselling.`;
    }
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

const getPaymentCourseKey = (program) => COURSE_PAYMENT_SLUGS[program] || normalizeCourseKey(program).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const showSubmittedNextSteps = (formStatus, payload, name, program) => {
    formStatus.innerHTML = '';
    formStatus.append(`Thank you, ${name}. Your enquiry for ${program} has been submitted. Reference: ${payload.referenceId}. Next: check email for the PDF receipt, review payment guidance, then send confirmation on WhatsApp. `);

    const paymentLink = document.createElement('a');
    paymentLink.href = `payment-details.html?course=${encodeURIComponent(getPaymentCourseKey(program))}&reference=${encodeURIComponent(payload.referenceId)}`;
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

    applyFormPrefill(form, formStatus);

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
