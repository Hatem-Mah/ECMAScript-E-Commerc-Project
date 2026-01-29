// Navigation and Navbar Module - ES6
import storageService from './storage.js';

class NavbarManager {
    constructor() {
        this.updateCartCounter();
        this.updateAuthLink();
        this.init();
    }

    init() {
        window.addEventListener('storage', () => {
            this.updateCartCounter();
        });

        document.addEventListener('cartUpdated', () => {
            this.updateCartCounter();
        });
    }

    updateCartCounter() {
        const cartCountElements = document.querySelectorAll('#cartCount');
        const count = storageService.getCartCount();
        
        cartCountElements.forEach(element => {
            element.textContent = count;
            element.style.display = count > 0 ? 'inline-block' : 'none';
        });
    }

    updateAuthLink() {
        const authLinks = document.querySelectorAll('#authLink');
        const isLoggedIn = storageService.isUserLoggedIn();
        const user = storageService.getUser();

        authLinks.forEach(link => {
            if (isLoggedIn && user) {
                link.style.display = 'none';
            } else {
                link.style.display = 'block';
                link.innerHTML = `<a href="pages/login.html" class="nav-link">Login</a>`;
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new NavbarManager();
});

export default NavbarManager;
