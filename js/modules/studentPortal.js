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
            'I need student access support.',
            `Registered mobile: ${mobile || 'not provided'}.`,
            `Enquiry reference ID: ${reference || 'not provided'}.`,
            'Please share my course/class updates.',
        ].join(' ');
        const whatsappUrl = `https://wa.me/918088835686?text=${encodeURIComponent(message)}`;

        status.innerHTML = '';
        status.append('Free access request is ready. ');
        const link = document.createElement('a');
        link.href = whatsappUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'Send details on WhatsApp';
        status.append(link);
    });
}
