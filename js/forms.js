function toggleForms(event) {
    if (event) event.preventDefault();

    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginToggle = document.getElementById('loginToggle');
    const registerToggle = document.getElementById('registerToggle');

    loginForm.classList.toggle('active');
    registerForm.classList.toggle('active');
    loginToggle.classList.toggle('active');
    registerToggle.classList.toggle('active');
}

document.addEventListener('DOMContentLoaded', () => {
    const loginToggle = document.getElementById('loginToggle');
    const registerToggle = document.getElementById('registerToggle');

    if (loginToggle) {
        loginToggle.addEventListener('click', toggleForms);
    }

    if (registerToggle) {
        registerToggle.addEventListener('click', toggleForms);
    }
});
