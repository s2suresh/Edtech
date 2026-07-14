export function initStudentPortal() {
    const form = document.getElementById('studentLoginForm');
    const status = document.getElementById('studentLoginStatus');
    const requestOtpButton = document.getElementById('requestOtpButton');
    const mobileInput = document.getElementById('studentMobile');

    if (!form || !status || !requestOtpButton || !mobileInput) {
        return;
    }

    requestOtpButton.addEventListener('click', () => {
        const mobile = mobileInput.value.trim();

        status.textContent = mobile
            ? `Real OTP is not connected yet for ${mobile}. To send OTP live, connect an SMS or WhatsApp OTP provider through a secure backend.`
            : 'Enter the registered mobile number first, then request OTP after the real OTP provider is connected.';
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const mobile = String(formData.get('mobile') || '').trim();

        status.textContent = `OTP verification for ${mobile || 'this mobile number'} needs a live OTP backend. This page does not use dummy OTPs or expose private course updates.`;
    });
}
