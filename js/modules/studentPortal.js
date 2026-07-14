export function initStudentPortal() {
    const form = document.getElementById('studentLoginForm');
    const status = document.getElementById('studentLoginStatus');

    if (!form || !status) {
        return;
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const mobile = String(formData.get('mobile') || '').trim();

        status.textContent = `Mobile ${mobile || 'number'} can be used as the student username after secure OTP/password backend is enabled. Private course updates are not exposed on this static page.`;
    });
}
