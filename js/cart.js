import storageService from './storage.js';

class ShoppingCart {
    constructor() {
        this.cartContent = document.getElementById('cartContent');
        this.cartSummary = document.getElementById('cartSummary');
        this.buyNowBtn = document.getElementById('buyNowBtn');
        this.init();
    }

    init() {
        this.renderCart();
        
        if (this.buyNowBtn) {
            this.buyNowBtn.addEventListener('click', () => this.checkout());
        }

        document.addEventListener('cartUpdated', () => {
            this.renderCart();
        });
    }

    renderCart() {
        const cart = storageService.getCart();

        if (cart.length === 0) {
            this.cartContent.innerHTML = '';
            
            const emptyCartDiv = document.createElement('div');
            emptyCartDiv.className = 'empty-cart';
            
            const emptyMessage = document.createElement('p');
            emptyMessage.textContent = '🛒 Your cart is empty';
            
            const continueShoppingLink = document.createElement('a');
            continueShoppingLink.href = 'products.html';
            continueShoppingLink.className = 'btn btn-primary';
            continueShoppingLink.textContent = 'Continue Shopping';
            
            emptyCartDiv.appendChild(emptyMessage);
            emptyCartDiv.appendChild(continueShoppingLink);
            this.cartContent.appendChild(emptyCartDiv);
            
            this.cartSummary.style.display = 'none';
            return;
        }

        this.cartSummary.style.display = 'block';

        this.cartContent.innerHTML = '';
        
        const cartItemsContainer = document.createElement('div');
        cartItemsContainer.className = 'cart-items';

        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';

            const imageDiv = document.createElement('div');
            imageDiv.className = 'cart-item-image';
            const img = document.createElement('img');
            img.src = item.image;
            img.alt = item.title;
            imageDiv.appendChild(img);

            const detailsDiv = document.createElement('div');
            detailsDiv.className = 'cart-item-details';
            
            const itemNameP = document.createElement('p');
            itemNameP.className = 'cart-item-name';
            itemNameP.textContent = item.title;
            
            const itemCategoryP = document.createElement('p');
            itemCategoryP.className = 'cart-item-category';
            itemCategoryP.textContent = item.category;
            
            const itemPriceP = document.createElement('p');
            itemPriceP.className = 'cart-item-price';
            itemPriceP.textContent = `$${item.price.toFixed(2)}`;
            
            detailsDiv.appendChild(itemNameP);
            detailsDiv.appendChild(itemCategoryP);
            detailsDiv.appendChild(itemPriceP);

            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'cart-item-actions';

            const quantityControl = document.createElement('div');
            quantityControl.className = 'quantity-control';
            
            const decreaseBtn = document.createElement('button');
            decreaseBtn.className = 'quantity-btn';
            decreaseBtn.dataset.action = 'decrease';
            decreaseBtn.dataset.productId = item.id;
            decreaseBtn.textContent = '−';
            
            const quantityInput = document.createElement('input');
            quantityInput.type = 'number';
            quantityInput.className = 'quantity-value';
            quantityInput.value = item.quantity;
            quantityInput.min = '1';
            quantityInput.dataset.productId = item.id;
            
            const increaseBtn = document.createElement('button');
            increaseBtn.className = 'quantity-btn';
            increaseBtn.dataset.action = 'increase';
            increaseBtn.dataset.productId = item.id;
            increaseBtn.textContent = '+';
            
            quantityControl.appendChild(decreaseBtn);
            quantityControl.appendChild(quantityInput);
            quantityControl.appendChild(increaseBtn);

            const itemTotalDiv = document.createElement('div');
            itemTotalDiv.className = 'item-total';
            itemTotalDiv.textContent = `$${(item.price * item.quantity).toFixed(2)}`;

            const removeBtn = document.createElement('button');
            removeBtn.className = 'btn-remove';
            removeBtn.dataset.productId = item.id;
            removeBtn.textContent = 'Remove';

            actionsDiv.appendChild(quantityControl);
            actionsDiv.appendChild(itemTotalDiv);
            actionsDiv.appendChild(removeBtn);

            cartItem.appendChild(imageDiv);
            cartItem.appendChild(detailsDiv);
            cartItem.appendChild(actionsDiv);

            cartItemsContainer.appendChild(cartItem);
        });

        this.cartContent.appendChild(cartItemsContainer);

        this.attachCartListeners();
        this.updateSummary();
    }

    attachCartListeners() {
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.productId);
                const action = e.target.dataset.action;

                const quantityInput = document.querySelector(
                    `.quantity-value[data-product-id="${productId}"]`
                );
                let newQuantity = parseInt(quantityInput.value);

                if (action === 'increase') {
                    newQuantity++;
                } else if (action === 'decrease' && newQuantity > 1) {
                    newQuantity--;
                }

                quantityInput.value = newQuantity;
                storageService.updateCartQuantity(productId, newQuantity);
                this.renderCart();
            });
        });

        document.querySelectorAll('.quantity-value').forEach(input => {
            input.addEventListener('change', (e) => {
                const productId = parseInt(e.target.dataset.productId);
                let newQuantity = parseInt(e.target.value);

                if (isNaN(newQuantity) || newQuantity < 1) {
                    newQuantity = 1;
                }

                e.target.value = newQuantity;
                storageService.updateCartQuantity(productId, newQuantity);
                this.renderCart();
            });
        });

        document.querySelectorAll('.btn-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.productId);
                if (confirm('Are you sure you want to remove this item?')) {
                    storageService.removeFromCart(productId);
                    this.renderCart();
                    document.dispatchEvent(new CustomEvent('cartUpdated'));
                }
            });
        });
    }

    updateSummary() {
        const subtotal = storageService.getCartTotal();
        const tax = subtotal * 0.1;
        const shipping = subtotal > 100 ? 0 : 10;
        const total = subtotal + tax + shipping;

        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    }

    checkout() {
        const cart = storageService.getCart();

        if (cart.length === 0) {
            alert('Your cart is empty');
            return;
        }

        const order = {
            items: cart,
            subtotal: storageService.getCartTotal(),
            tax: storageService.getCartTotal() * 0.1,
            shipping: storageService.getCartTotal() > 100 ? 0 : 10,
            total: storageService.getCartTotal() + (storageService.getCartTotal() * 0.1) + (storageService.getCartTotal() > 100 ? 0 : 10),
            status: Math.random() > 0.3 ? 'success' : 'shipped'
        };

        storageService.addOrder(order);

        storageService.clearCart();
        document.dispatchEvent(new CustomEvent('cartUpdated'));

        window.location.href = `checkout-success.html?status=${order.status}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ShoppingCart();
});

export default ShoppingCart;
