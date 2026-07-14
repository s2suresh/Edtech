export function initStudentPortal() {
    const form = document.getElementById('studentLoginForm');
    const status = document.getElementById('studentLoginStatus');
    const mobileInput = document.getElementById('studentMobile');
    const referenceInput = document.getElementById('studentReference');

    if (!form || !status || !mobileInput || !referenceInput) {
        return;
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const mobile = String(formData.get('mobile') || '').trim();
        const reference = String(formData.get('reference') || '').trim();
        const message = [
            'Hi Sharusuri EdTech,',
            'I need student access verification.',
            `Registered mobile: ${mobile || 'not provided'}.`,
            `Enquiry reference ID: ${reference || 'not provided'}.`,
            'Please verify my enquiry record and share my course/dashboard access details.',
        ].join(' ');
        const whatsappUrl = `https://wa.me/918088835686?text=${encodeURIComponent(message)}`;

        status.innerHTML = '';
        status.append('Verification request is ready. Backend matching will use registered mobile plus reference ID; for now, send it to support. ');
        const link = document.createElement('a');
        link.href = whatsappUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'Send verification on WhatsApp';
        status.append(link);
    });
}
