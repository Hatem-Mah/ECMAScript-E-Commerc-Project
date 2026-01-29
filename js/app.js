import apiService from './api.js';
import storageService from './storage.js';

class ShopApp {
    constructor() {
        this.featuredProductsContainer = document.getElementById('featuredProducts');
        this.init();
    }

    async init() {
        try {
            await this.loadFeaturedProducts();
        } catch (error) {
            console.error('Error initializing app:', error);
            this.featuredProductsContainer.innerHTML = '<p>Error loading products. Please try again.</p>';
        }
    }

    async loadFeaturedProducts() {
        try {
            const products = await apiService.fetchProducts();
            const featured = this.getRandomProducts(products, 8);
            this.renderProducts(featured);
        } catch (error) {
            console.error('Error loading featured products:', error);
            this.featuredProductsContainer.innerHTML = '<p>Error loading products. Please try again.</p>';
        }
    }

    getRandomProducts(products, count) {
        const shuffled = [...products].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }

    renderProducts(products) {
        this.featuredProductsContainer.innerHTML = products.map(product => `
            <div class="product-card">
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.title}" class="product-image">
                    ${product.inStock ? '' : '<div class="product-badge">Out of Stock</div>'}
                </div>
                <div class="product-info">
                    <p class="product-category">${product.category}</p>
                    <p class="product-name">${product.title}</p>
                    <p class="product-rating">⭐ ${product.rating.rate} (${product.rating.count})</p>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <div class="product-actions">
                        <button class="btn-view-details" data-product-id="${product.id}">👁️ View</button>
                        <button class="btn-add-cart" data-product-id="${product.id}" ${!product.inStock ? 'disabled' : ''}>
                            ${product.inStock ? '+ Add' : 'N/A'}
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        this.attachProductListeners();
    }

    attachProductListeners() {
        document.querySelectorAll('.btn-view-details').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.dataset.productId;
                window.location.href = `pages/product-details.html?id=${productId}`;
            });
        });

        document.querySelectorAll('.btn-add-cart').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const productId = parseInt(e.target.dataset.productId);
                await this.handleAddToCart(productId, e.target);
            });
        });
    }

    async handleAddToCart(productId, btnElement) {
        try {
            const products = await apiService.fetchProducts();
            const product = products.find(p => p.id === productId);

            if (product) {
                storageService.addToCart(product, 1);
                
                const originalText = btnElement.textContent;
                btnElement.textContent = '✓ Added';
                btnElement.style.backgroundColor = '#10b981';

                document.dispatchEvent(new CustomEvent('cartUpdated'));

                setTimeout(() => {
                    btnElement.textContent = originalText;
                    btnElement.style.backgroundColor = '';
                }, 1500);
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Error adding product to cart');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ShopApp();
});

export default ShopApp;
