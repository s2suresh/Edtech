document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('leadForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your interest!');
        form.reset();
    });
});
