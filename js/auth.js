import storageService from './storage.js';
import { FormValidator, FormDisplay } from './validators.js';

class AuthManager {
    constructor() {
        this.loginForm = document.getElementById('loginForm');
        this.registerForm = document.getElementById('registerForm');
        this.init();
    }

    init() {
        if (this.loginForm) {
            this.loginForm.addEventListener('submit', (e) =>
                this.handleLogin(e)
            );
        }

        if (this.registerForm) {
            this.registerForm.addEventListener('submit', (e) =>
                this.handleRegister(e)
            );
        }
    }

    isUserRegistered(email, password) {
        const users = JSON.parse(
            localStorage.getItem('es6_shop_users') || '[]'
        );
        const user = users.find(u => u.email === email && u.password === password);
        return user || null;
    }

    isEmailExists(email) {
        const users = JSON.parse(
            localStorage.getItem('es6_shop_users') || '[]'
        );
        return users.some(u => u.email === email);
    }

    handleRegister(event) {
        event.preventDefault();

        const nameInput = document.getElementById('registerName');
        const emailInput = document.getElementById('registerEmail');
        const passwordInput = document.getElementById('registerPassword');
        const confirmPasswordInput = document.getElementById('registerConfirmPassword');

        const name = nameInput?.value.trim();
        const email = emailInput?.value.trim();
        const password = passwordInput?.value.trim();
        const confirmPassword = confirmPasswordInput?.value.trim();

        if (!FormValidator.validateRequired(name)) {
            FormDisplay.showError(nameInput, 'Name is required');
            return;
        }

        if (!FormValidator.validateName(name)) {
            FormDisplay.showError(nameInput, 'Name must be between 2 and 50 characters');
            return;
        }

        if (!FormValidator.validateRequired(email)) {
            FormDisplay.showError(emailInput, 'Email is required');
            return;
        }

        if (!FormValidator.validateEmail(email)) {
            FormDisplay.showError(emailInput, 'Invalid email format');
            return;
        }

        if (this.isEmailExists(email)) {
            FormDisplay.showError(emailInput, 'Email already registered. Please login or use a different email');
            return;
        }

        if (!FormValidator.validateRequired(password)) {
            FormDisplay.showError(passwordInput, 'Password is required');
            return;
        }

        if (!FormValidator.validatePassword(password)) {
            const requirements = FormValidator.getPasswordRequirements(password);
            let message = 'Password must have: ';
            const missing = [];

            if (!requirements.minLength) missing.push('8+ characters');
            if (!requirements.hasUppercase) missing.push('uppercase letter');
            if (!requirements.hasLowercase) missing.push('lowercase letter');
            if (!requirements.hasNumber) missing.push('number');

            message += missing.join(', ');
            FormDisplay.showError(passwordInput, message);
            return;
        }

        if (!FormValidator.validateRequired(confirmPassword)) {
            FormDisplay.showError(confirmPasswordInput, 'Please confirm password');
            return;
        }

        if (!FormValidator.validatePasswordMatch(password, confirmPassword)) {
            FormDisplay.showError(confirmPasswordInput, 'Passwords do not match');
            return;
        }

        const users = JSON.parse(
            localStorage.getItem('es6_shop_users') || '[]'
        );

        const newUser = {
            id: Date.now(),
            name,
            email,
            password
        };

        users.push(newUser);
        localStorage.setItem('es6_shop_users', JSON.stringify(users));

        alert(`Welcome, ${name}! Your account has been created successfully. Please login to continue.`);

        this.registerForm.reset();
        setTimeout(() => {
            window.location.href = './login.html';
        }, 500);
    }

    handleLogin(event) {
        event.preventDefault();

        const emailInput = document.getElementById('loginEmail');
        const passwordInput = document.getElementById('loginPassword');

        const email = emailInput?.value.trim();
        const password = passwordInput?.value.trim();

        if (!FormValidator.validateRequired(email)) {
            FormDisplay.showError(emailInput, 'Email is required');
            return;
        }

        if (!FormValidator.validateEmail(email)) {
            FormDisplay.showError(emailInput, 'Invalid email format');
            return;
        }

        if (!FormValidator.validateRequired(password)) {
            FormDisplay.showError(passwordInput, 'Password is required');
            return;
        }

        const user = this.isUserRegistered(email, password);

        if (!user) {
            FormDisplay.showError(passwordInput, 'User not found or incorrect credentials');
            return;
        }

        storageService.setUser({
            id: user.id,
            name: user.name,
            email: user.email
        });

        document.dispatchEvent(
            new CustomEvent('userLoggedIn', { detail: user })
        );

        this.removeLoginFromNavbar();

        alert(`Welcome back, ${user.name}!`);

        this.loginForm.reset();
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 500);
    }

    removeLoginFromNavbar() {
        const authLinks = document.querySelectorAll('#authLink');
        authLinks.forEach(link => {
            link.style.display = 'none';
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
});

export default AuthManager;
