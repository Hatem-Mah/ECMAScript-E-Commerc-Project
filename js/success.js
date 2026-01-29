import storageService from './storage.js';

class SuccessPage {
    constructor() {
        this.container = document.getElementById('successContainer');
        this.init();
    }

    init() {
        const status = this.getStatusFromURL();
        const orders = storageService.getOrders();
        const lastOrder = orders[orders.length - 1];

        if (lastOrder) {
            this.renderSuccess(lastOrder, status);
        } else {
            this.showNoOrderMessage();
        }
    }

    showNoOrderMessage() {
        this.container.innerHTML = '';
        
        const successDiv = document.createElement('div');
        successDiv.className = 'success-container';
        
        const msgP = document.createElement('p');
        msgP.textContent = 'No order information found.';
        
        const link = document.createElement('a');
        link.href = 'products.html';
        link.className = 'btn btn-primary';
        link.textContent = 'Continue Shopping';
        
        successDiv.appendChild(msgP);
        successDiv.appendChild(link);
        this.container.appendChild(successDiv);
    }

    getStatusFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('status') || 'success';
    }

    renderSuccess(order, status) {
        const isSuccess = status === 'success';
        const icon = isSuccess ? '✓' : '🚚';
        const title = isSuccess ? 'Order Confirmed!' : 'Order Shipped!';
        const message = isSuccess 
            ? 'Thank you for your purchase! Your order has been confirmed.'
            : 'Your order is on the way! Track your shipment below.';

        const orderDate = new Date(order.date).toLocaleDateString();
        const estimatedDelivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString();

        // Clear container
        this.container.innerHTML = '';

        // Create success message container
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';

        // Icon
        const iconDiv = document.createElement('div');
        iconDiv.className = 'success-icon';
        iconDiv.textContent = icon;

        // Title
        const titleH2 = document.createElement('h2');
        titleH2.textContent = title;

        // Message
        const msgP = document.createElement('p');
        msgP.textContent = message;

        // Order details
        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'order-details';

        const orderDetails = [
            { label: 'Order ID:', value: `#${order.id}` },
            { label: 'Order Date:', value: orderDate },
            { label: 'Items:', value: `${order.items.length} products` },
            { label: 'Subtotal:', value: `$${order.subtotal.toFixed(2)}` },
            { label: 'Tax:', value: `$${order.tax.toFixed(2)}` },
            { label: 'Shipping:', value: `$${order.shipping.toFixed(2)}` },
            { label: 'Total Amount:', value: `$${order.total.toFixed(2)}` }
        ];

        orderDetails.forEach(detail => {
            const row = document.createElement('div');
            row.className = 'detail-row';

            const label = document.createElement('span');
            label.className = 'detail-label';
            label.textContent = detail.label;

            const value = document.createElement('span');
            value.className = 'detail-value';
            value.textContent = detail.value;

            row.appendChild(label);
            row.appendChild(value);
            detailsDiv.appendChild(row);
        });

        // Shipping info
        const shippingDiv = document.createElement('div');
        shippingDiv.className = 'shipping-info';

        const shippingH4 = document.createElement('h4');
        shippingH4.textContent = isSuccess ? 'Estimated Delivery' : 'Shipped On';

        const shippingP = document.createElement('p');
        shippingP.textContent = isSuccess ? estimatedDelivery : orderDate;

        shippingDiv.appendChild(shippingH4);
        shippingDiv.appendChild(shippingP);

        // Action buttons
        const actionButtons = document.createElement('div');
        actionButtons.className = 'action-buttons';

        const homeLink = document.createElement('a');
        homeLink.href = '../index.html';
        homeLink.className = 'btn btn-primary';
        homeLink.textContent = 'Back to Home';

        const shopLink = document.createElement('a');
        shopLink.href = 'products.html';
        shopLink.className = 'btn btn-secondary';
        shopLink.textContent = 'Continue Shopping';

        actionButtons.appendChild(homeLink);
        actionButtons.appendChild(shopLink);

        // Assemble success message
        successMessage.appendChild(iconDiv);
        successMessage.appendChild(titleH2);
        successMessage.appendChild(msgP);
        successMessage.appendChild(detailsDiv);
        successMessage.appendChild(shippingDiv);
        successMessage.appendChild(actionButtons);

        // Add to container
        this.container.appendChild(successMessage);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SuccessPage();
});

export default SuccessPage;
