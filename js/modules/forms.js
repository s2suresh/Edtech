export function initLeadForm() {
    const form = document.getElementById('leadForm');
    const formStatus = document.getElementById('formStatus');

    if (!form || !formStatus) {
        return;
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const name = String(formData.get('name') || '').trim();
        const program = String(formData.get('program') || '').trim();

        formStatus.textContent = `Thank you, ${name}. Your enquiry for ${program} has been noted.`;
        form.reset();
    });
}
