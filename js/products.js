// Products Page Module - ES6 with async/await
import apiService from './api.js';
import storageService from './storage.js';

class ProductsPage {
    constructor() {
        this.productsGrid = document.getElementById('productsGrid');
        this.noProductsMessage = document.getElementById('noProducts');
        this.sortSelect = document.getElementById('sortBy');
        this.resetFiltersBtn = document.getElementById('resetFilters');
        
        this.allProducts = [];
        this.filteredProducts = [];
        this.filters = {};
        
        this.init();
    }

    async init() {
        try {
            await this.loadProducts();
            this.attachEventListeners();
            this.loadCategoriesFromProducts();
        } catch (error) {
            console.error('Error initializing products page:', error);
            this.showErrorMessage('Error loading products. Please try again.');
        }
    }

    showErrorMessage(message) {
        this.productsGrid.innerHTML = '';
        const errorP = document.createElement('p');
        errorP.textContent = message;
        this.productsGrid.appendChild(errorP);
    }

    async loadProducts() {
        try {
            this.allProducts = await apiService.fetchProducts();
            this.filteredProducts = [...this.allProducts];
            this.renderProducts();
        } catch (error) {
            console.error('Error loading products:', error);
            throw error;
        }
    }

    loadCategoriesFromProducts() {
        const categories = [...new Set(this.allProducts.map(p => p.category))];
        const categoryFilter = document.getElementById('categoryFilter');
        
        if (categoryFilter) {
            categoryFilter.innerHTML = '';
            
            // Add "All" option
            const allLabel = document.createElement('label');
            allLabel.className = 'filter-label';
            const allCheckbox = document.createElement('input');
            allCheckbox.type = 'checkbox';
            allCheckbox.value = 'all';
            allCheckbox.checked = true;
            allLabel.appendChild(allCheckbox);
            allLabel.appendChild(document.createTextNode(' All'));
            categoryFilter.appendChild(allLabel);
            
            // Add category options
            categories.forEach(category => {
                const label = document.createElement('label');
                label.className = 'filter-label';
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = category;
                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(' ' + category.charAt(0).toUpperCase() + category.slice(1)));
                categoryFilter.appendChild(label);
            });

            // Add event listeners to category checkboxes
            categoryFilter.querySelectorAll('input').forEach(checkbox => {
                checkbox.addEventListener('change', () => this.applyFilters());
            });
        }
    }

    attachEventListeners() {
        // Sort
        if (this.sortSelect) {
            this.sortSelect.addEventListener('change', (e) => this.handleSort(e.target.value));
        }

        // Reset filters
        if (this.resetFiltersBtn) {
            this.resetFiltersBtn.addEventListener('click', () => this.resetFilters());
        }

        // Price range
        const priceSlider = document.getElementById('priceSlider');
        const minPriceInput = document.getElementById('minPrice');
        const maxPriceInput = document.getElementById('maxPrice');
        const priceValue = document.getElementById('priceValue');

        if (priceSlider) {
            priceSlider.addEventListener('input', (e) => {
                const maxPrice = parseInt(e.target.value);
                priceValue.textContent = maxPrice;
                if (maxPriceInput) maxPriceInput.value = maxPrice;
                this.applyFilters();
            });
        }

        if (minPriceInput) {
            minPriceInput.addEventListener('input', () => this.applyFilters());
        }

        if (maxPriceInput) {
            maxPriceInput.addEventListener('input', () => this.applyFilters());
        }

        // Availability filter
        const sizeFilter = document.getElementById('sizeFilter');
        if (sizeFilter) {
            sizeFilter.querySelectorAll('input').forEach(checkbox => {
                checkbox.addEventListener('change', () => this.applyFilters());
            });
        }

        // Rating filter
        const ratingFilter = document.getElementById('ratingFilter');
        if (ratingFilter) {
            ratingFilter.querySelectorAll('input').forEach(checkbox => {
                checkbox.addEventListener('change', () => this.applyFilters());
            });
        }
    }

    applyFilters() {
        let filtered = [...this.allProducts];

        // Category filter
        const selectedCategories = Array.from(
            document.querySelectorAll('#categoryFilter input:checked')
        ).map(input => input.value);

        if (!selectedCategories.includes('all')) {
            filtered = filtered.filter(p => selectedCategories.includes(p.category));
        }

        // Price filter
        const maxPriceSlider = document.getElementById('priceSlider')?.value || 1000;
        filtered = filtered.filter(p => p.price <= parseFloat(maxPriceSlider));

        // Availability filter
        const selectedAvailability = Array.from(
            document.querySelectorAll('#sizeFilter input:checked')
        ).map(input => input.value);

        if (selectedAvailability.includes('in-stock')) {
            filtered = filtered.filter(p => p.inStock);
        }

        // Rating filter
        const selectedRatings = Array.from(
            document.querySelectorAll('#ratingFilter input:checked')
        ).map(input => parseFloat(input.value));

        if (selectedRatings.length > 0) {
            filtered = filtered.filter(p => {
                const minRating = Math.min(...selectedRatings);
                return parseFloat(p.rating.rate) >= minRating;
            });
        }

        this.filteredProducts = filtered;
        this.renderProducts();
    }

    handleSort(sortBy) {
        const sorted = [...this.filteredProducts];

        switch (sortBy) {
            case 'price-low':
                sorted.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                sorted.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                sorted.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'rating':
                sorted.sort((a, b) => parseFloat(b.rating.rate) - parseFloat(a.rating.rate));
                break;
            default:
                break;
        }

        this.filteredProducts = sorted;
        this.renderProducts();
    }

    resetFilters() {
        // Reset checkboxes
        document.querySelectorAll('#categoryFilter input').forEach(input => {
            input.checked = input.value === 'all';
        });

        document.querySelectorAll('#sizeFilter input').forEach(input => {
            input.checked = input.value === 'all-items';
        });

        document.querySelectorAll('#ratingFilter input').forEach(input => {
            input.checked = false;
        });

        // Reset price
        const priceSlider = document.getElementById('priceSlider');
        const priceValue = document.getElementById('priceValue');
        if (priceSlider) {
            priceSlider.value = 1000;
            priceValue.textContent = 1000;
        }

        // Reset sort
        if (this.sortSelect) {
            this.sortSelect.value = 'default';
        }

        this.filteredProducts = [...this.allProducts];
        this.renderProducts();
    }

    renderProducts() {
        if (this.filteredProducts.length === 0) {
            this.productsGrid.innerHTML = '';
            this.noProductsMessage.style.display = 'block';
            return;
        }

        this.noProductsMessage.style.display = 'none';
        this.productsGrid.innerHTML = '';

        this.filteredProducts.forEach(product => {
            // Create product card
            const card = document.createElement('div');
            card.className = 'product-card';

            // Image container
            const imageContainer = document.createElement('div');
            imageContainer.className = 'product-image-container';
            
            const img = document.createElement('img');
            img.src = product.image;
            img.alt = product.title;
            img.className = 'product-image';
            imageContainer.appendChild(img);
            
            if (!product.inStock) {
                const badge = document.createElement('div');
                badge.className = 'product-badge';
                badge.textContent = 'Out of Stock';
                imageContainer.appendChild(badge);
            }

            // Product info
            const info = document.createElement('div');
            info.className = 'product-info';
            
            const categoryP = document.createElement('p');
            categoryP.className = 'product-category';
            categoryP.textContent = product.category;
            
            const nameP = document.createElement('p');
            nameP.className = 'product-name';
            nameP.textContent = product.title;
            
            const ratingP = document.createElement('p');
            ratingP.className = 'product-rating';
            ratingP.textContent = `⭐ ${product.rating.rate} (${product.rating.count})`;
            
            const priceP = document.createElement('p');
            priceP.className = 'product-price';
            priceP.textContent = `$${product.price.toFixed(2)}`;
            
            // Actions
            const actions = document.createElement('div');
            actions.className = 'product-actions';
            
            const viewBtn = document.createElement('button');
            viewBtn.className = 'btn-view-details';
            viewBtn.dataset.productId = product.id;
            viewBtn.textContent = '👁️ View';
            
            const addBtn = document.createElement('button');
            addBtn.className = 'btn-add-cart';
            addBtn.dataset.productId = product.id;
            if (!product.inStock) {
                addBtn.disabled = true;
                addBtn.textContent = 'N/A';
            } else {
                addBtn.textContent = '+ Add';
            }
            
            actions.appendChild(viewBtn);
            actions.appendChild(addBtn);
            
            // Assemble info
            info.appendChild(categoryP);
            info.appendChild(nameP);
            info.appendChild(ratingP);
            info.appendChild(priceP);
            info.appendChild(actions);
            
            // Assemble card
            card.appendChild(imageContainer);
            card.appendChild(info);
            
            // Add to grid
            this.productsGrid.appendChild(card);
        });

        this.attachProductListeners();
    }

    attachProductListeners() {
        // View product details
        document.querySelectorAll('.btn-view-details').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.dataset.productId;
                window.location.href = `product-details.html?id=${productId}`;
            });
        });

        // Add to cart
        document.querySelectorAll('.btn-add-cart').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const productId = parseInt(e.target.dataset.productId);
                await this.handleAddToCart(productId, e.target);
            });
        });
    }

    async handleAddToCart(productId, btnElement) {
        try {
            const product = this.allProducts.find(p => p.id === productId);

            if (product) {
                storageService.addToCart(product, 1);

                // Update button feedback
                const originalText = btnElement.textContent;
                btnElement.textContent = '✓ Added';
                btnElement.style.backgroundColor = '#10b981';

                // Dispatch custom event
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProductsPage();
});

export default ProductsPage;
