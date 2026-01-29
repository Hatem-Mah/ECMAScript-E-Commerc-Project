class FormValidator {
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static validatePassword(password) {
        if (password.length < 8) {
            return false;
        }

        if (!/[A-Z]/.test(password)) {
            return false;
        }

        if (!/[a-z]/.test(password)) {
            return false;
        }

        if (!/[0-9]/.test(password)) {
            return false;
        }

        return true;
    }

    static validateName(name) {
        return name && name.length >= 2 && name.length <= 50;
    }

    static validateRequired(value) {
        return value && value.trim() !== '';
    }

    static validateNumber(value, min = 0, max = Infinity) {
        const num = parseFloat(value);
        return !isNaN(num) && num >= min && num <= max;
    }

    static validatePasswordMatch(password, confirmPassword) {
        return password === confirmPassword;
    }

    static getPasswordRequirements(password) {
        const requirements = {
            minLength: password.length >= 8,
            hasUppercase: /[A-Z]/.test(password),
            hasLowercase: /[a-z]/.test(password),
            hasNumber: /[0-9]/.test(password)
        };

        return requirements;
    }

    static getPasswordStrength(password) {
        const requirements = this.getPasswordRequirements(password);
        const metRequirements = Object.values(requirements).filter(val => val).length;
        
        if (metRequirements === 0) return 'Very Weak';
        if (metRequirements === 1) return 'Weak';
        if (metRequirements === 2) return 'Fair';
        if (metRequirements === 3) return 'Good';
        return 'Strong';
    }
}

class FormDisplay {
    static showError(inputElement, errorMessage) {
        if (!inputElement) return;

        inputElement.classList.add('error');

        const errorElement = document.getElementById(
            `${inputElement.id}Error`
        );
        if (errorElement) {
            errorElement.textContent = errorMessage;
            errorElement.style.display = 'block';
        }
    }

    static hideError(inputElement) {
        if (!inputElement) return;

        inputElement.classList.remove('error');

        const errorElement = document.getElementById(
            `${inputElement.id}Error`
        );
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }

    static showSuccess(inputElement) {
        if (!inputElement) return;
        inputElement.classList.add('success');
        inputElement.classList.remove('error');
    }

    static clearField(inputElement) {
        if (!inputElement) return;
        inputElement.value = '';
        inputElement.classList.remove('error', 'success');

        const errorElement = document.getElementById(
            `${inputElement.id}Error`
        );
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }

    static disableButton(buttonElement) {
        if (!buttonElement) return;
        buttonElement.disabled = true;
        buttonElement.style.opacity = '0.5';
        buttonElement.style.cursor = 'not-allowed';
    }

    static enableButton(buttonElement) {
        if (!buttonElement) return;
        buttonElement.disabled = false;
        buttonElement.style.opacity = '1';
        buttonElement.style.cursor = 'pointer';
    }
}

export { FormValidator, FormDisplay };
