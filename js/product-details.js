// Product Details Page Module - ES6 with async/await
import apiService from './api.js';
import storageService from './storage.js';

class ProductDetailsPage {
    constructor() {
        this.container = document.getElementById('productDetailsContainer');
        this.init();
    }

    async init() {
        try {
            const productId = this.getProductIdFromURL();
            if (productId) {
                await this.loadProductDetails(productId);
            } else {
                this.showErrorMessage('Product not found. Please go back and select a product.');
            }
        } catch (error) {
            console.error('Error initializing product details:', error);
            this.showErrorMessage('Error loading product details. Please try again.');
        }
    }

    showErrorMessage(message) {
        this.container.innerHTML = '';
        const errorP = document.createElement('p');
        errorP.textContent = message;
        this.container.appendChild(errorP);
    }

    getProductIdFromURL() {
        const params = new URLSearchParams(window.location.search);
        return parseInt(params.get('id'));
    }

    async loadProductDetails(productId) {
        try {
            const product = await apiService.fetchProductById(productId);
            this.renderProductDetails(product);
            this.attachEventListeners(product);
        } catch (error) {
            console.error('Error loading product:', error);
            this.showErrorMessage('Error loading product. Please try again.');
        }
    }

    renderProductDetails(product) {
        document.getElementById('productName').textContent = product.title;

        this.container.innerHTML = '';

        const productDetailsDiv = document.createElement('div');
        productDetailsDiv.className = 'product-details';

        const imageSectionDiv = document.createElement('div');
        imageSectionDiv.className = 'product-image-section';
        
        const imageMainDiv = document.createElement('div');
        imageMainDiv.className = 'product-image-main';
        
        const img = document.createElement('img');
        img.src = product.image;
        img.alt = product.title;
        
        imageMainDiv.appendChild(img);
        imageSectionDiv.appendChild(imageMainDiv);

        const infoSectionDiv = document.createElement('div');
        infoSectionDiv.className = 'product-info-section';

        const headerDiv = document.createElement('div');
        headerDiv.className = 'product-header';
        
        const categorySpan = document.createElement('span');
        categorySpan.className = 'product-category-tag';
        categorySpan.textContent = product.category;
        
        const nameH1 = document.createElement('h1');
        nameH1.className = 'product-name';
        nameH1.textContent = product.title;
        
        headerDiv.appendChild(categorySpan);
        headerDiv.appendChild(nameH1);

        const ratingDiv = document.createElement('div');
        ratingDiv.className = 'product-rating-section';
        
        const ratingSpan = document.createElement('span');
        ratingSpan.className = 'product-rating';
        ratingSpan.textContent = `⭐ ${product.rating.rate}`;
        
        const countSpan = document.createElement('span');
        countSpan.className = 'rating-count';
        countSpan.textContent = `(${product.rating.count} reviews)`;
        
        ratingDiv.appendChild(ratingSpan);
        ratingDiv.appendChild(countSpan);

        const priceDiv = document.createElement('div');
        priceDiv.className = 'product-price-section';
        
        const priceValue = document.createElement('div');
        priceValue.className = 'product-price';
        priceValue.textContent = `$${product.price.toFixed(2)}`;
        
        const priceLabel = document.createElement('p');
        priceLabel.className = 'price-label';
        priceLabel.textContent = 'Price';
        
        const stockDiv = document.createElement('div');
        stockDiv.className = `product-stock ${product.inStock ? 'stock-available' : 'stock-unavailable'}`;
        stockDiv.textContent = product.inStock ? '✓ In Stock' : '✗ Out of Stock';
        
        priceDiv.appendChild(priceValue);
        priceDiv.appendChild(priceLabel);
        priceDiv.appendChild(stockDiv);

        const descriptionP = document.createElement('p');
        descriptionP.className = 'product-description';
        descriptionP.textContent = product.description;

        const featuresDiv = document.createElement('div');
        featuresDiv.className = 'product-features';
        
        const features = [
            'Premium Quality Product',
            'Authentic & Original',
            'Fast Shipping Available',
            'Easy Returns & Refunds',
            'Secure Checkout'
        ];
        
        features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            featuresDiv.appendChild(li);
        });

        const quantitySelectorDiv = document.createElement('div');
        quantitySelectorDiv.className = 'quantity-selector';
        
        const decreaseBtn = document.createElement('button');
        decreaseBtn.className = 'quantity-btn';
        decreaseBtn.id = 'decreaseQty';
        decreaseBtn.textContent = '−';
        
        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.id = 'quantityInput';
        quantityInput.className = 'quantity-input';
        quantityInput.value = '1';
        quantityInput.min = '1';
        quantityInput.max = '100';
        
        const increaseBtn = document.createElement('button');
        increaseBtn.className = 'quantity-btn';
        increaseBtn.id = 'increaseQty';
        increaseBtn.textContent = '+';
        
        quantitySelectorDiv.appendChild(decreaseBtn);
        quantitySelectorDiv.appendChild(quantityInput);
        quantitySelectorDiv.appendChild(increaseBtn);

        const actionButtonsDiv = document.createElement('div');
        actionButtonsDiv.className = 'action-buttons';
        
        const addToCartBtn = document.createElement('button');
        addToCartBtn.className = 'btn-add-to-cart';
        addToCartBtn.id = 'addToCartBtn';
        addToCartBtn.innerHTML = '🛒 Add to Cart';
        if (!product.inStock) addToCartBtn.disabled = true;
        
        const buyNowBtn = document.createElement('button');
        buyNowBtn.className = 'btn-buy-now';
        buyNowBtn.id = 'buyNowBtn';
        buyNowBtn.innerHTML = '💳 Buy Now';
        if (!product.inStock) buyNowBtn.disabled = true;
        
        const wishlistBtn = document.createElement('button');
        wishlistBtn.className = 'btn-wishlist';
        wishlistBtn.id = 'wishlistBtn';
        wishlistBtn.textContent = '♡ Wishlist';
        
        actionButtonsDiv.appendChild(addToCartBtn);
        actionButtonsDiv.appendChild(buyNowBtn);
        actionButtonsDiv.appendChild(wishlistBtn);

        infoSectionDiv.appendChild(headerDiv);
        infoSectionDiv.appendChild(ratingDiv);
        infoSectionDiv.appendChild(priceDiv);
        infoSectionDiv.appendChild(descriptionP);
        infoSectionDiv.appendChild(featuresDiv);
        infoSectionDiv.appendChild(quantitySelectorDiv);
        infoSectionDiv.appendChild(actionButtonsDiv);

        productDetailsDiv.appendChild(imageSectionDiv);
        productDetailsDiv.appendChild(infoSectionDiv);

        this.container.appendChild(productDetailsDiv);
    }

    attachEventListeners(product) {
        const quantityInput = document.getElementById('quantityInput');
        const decreaseBtn = document.getElementById('decreaseQty');
        const increaseBtn = document.getElementById('increaseQty');
        const addToCartBtn = document.getElementById('addToCartBtn');
        const buyNowBtn = document.getElementById('buyNowBtn');
        const wishlistBtn = document.getElementById('wishlistBtn');

        if (decreaseBtn) {
            decreaseBtn.addEventListener('click', () => {
                let qty = parseInt(quantityInput.value);
                if (qty > 1) {
                    quantityInput.value = qty - 1;
                }
            });
        }

        if (increaseBtn) {
            increaseBtn.addEventListener('click', () => {
                let qty = parseInt(quantityInput.value);
                quantityInput.value = qty + 1;
            });
        }

        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                const quantity = parseInt(quantityInput.value);
                this.addToCart(product, quantity);
            });
        }

        if (buyNowBtn) {
            buyNowBtn.addEventListener('click', () => {
                const quantity = parseInt(quantityInput.value);
                this.addToCart(product, quantity);
                setTimeout(() => {
                    window.location.href = 'cart.html';
                }, 500);
            });
        }

        if (wishlistBtn) {
            const isInWishlist = storageService.isInWishlist(product.id);
            if (isInWishlist) {
                wishlistBtn.textContent = '♥ In Wishlist';
                wishlistBtn.style.color = 'var(--danger-color)';
            }

            wishlistBtn.addEventListener('click', () => {
                if (storageService.isInWishlist(product.id)) {
                    storageService.removeFromWishlist(product.id);
                    wishlistBtn.textContent = '♡ Wishlist';
                    wishlistBtn.style.color = '';
                } else {
                    storageService.addToWishlist(product);
                    wishlistBtn.textContent = '♥ In Wishlist';
                    wishlistBtn.style.color = 'var(--danger-color)';
                }
            });
        }
    }

    addToCart(product, quantity) {
        for (let i = 0; i < quantity; i++) {
            storageService.addToCart(product, 1);
        }

        const addBtn = document.getElementById('addToCartBtn');
        const originalText = addBtn.textContent;
        addBtn.textContent = '✓ Added to Cart';
        addBtn.style.backgroundColor = '#10b981';

        document.dispatchEvent(new CustomEvent('cartUpdated'));

        setTimeout(() => {
            addBtn.textContent = originalText;
            addBtn.style.backgroundColor = '';
        }, 1500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ProductDetailsPage();
});

export default ProductDetailsPage;
