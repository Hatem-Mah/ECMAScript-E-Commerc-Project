class LocalStorageService {
    constructor() {
        this.prefix = 'es6_shop_';
    }

    setUser(userData) {
        try {
            localStorage.setItem(
                `${this.prefix}user`,
                JSON.stringify(userData)
            );
            return true;
        } catch (error) {
            console.error('Error saving user:', error);
            return false;
        }
    }

    getUser() {
        try {
            const userData = localStorage.getItem(`${this.prefix}user`);
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Error retrieving user:', error);
            return null;
        }
    }

    removeUser() {
        try {
            localStorage.removeItem(`${this.prefix}user`);
            return true;
        } catch (error) {
            console.error('Error removing user:', error);
            return false;
        }
    }

    isUserLoggedIn() {
        return this.getUser() !== null;
    }

    setCart(cartItems) {
        try {
            localStorage.setItem(
                `${this.prefix}cart`,
                JSON.stringify(cartItems)
            );
            return true;
        } catch (error) {
            console.error('Error saving cart:', error);
            return false;
        }
    }

    getCart() {
        try {
            const cartData = localStorage.getItem(`${this.prefix}cart`);
            return cartData ? JSON.parse(cartData) : [];
        } catch (error) {
            console.error('Error retrieving cart:', error);
            return [];
        }
    }

    addToCart(product, quantity = 1) {
        try {
            const cart = this.getCart();
            const existingItem = cart.find(item => item.id === product.id);

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({
                    ...product,
                    quantity
                });
            }

            this.setCart(cart);
            return true;
        } catch (error) {
            console.error('Error adding to cart:', error);
            return false;
        }
    }

    removeFromCart(productId) {
        try {
            const cart = this.getCart();
            const filteredCart = cart.filter(item => item.id !== productId);
            this.setCart(filteredCart);
            return true;
        } catch (error) {
            console.error('Error removing from cart:', error);
            return false;
        }
    }

    updateCartQuantity(productId, quantity) {
        try {
            const cart = this.getCart();
            const item = cart.find(item => item.id === productId);
            
            if (item) {
                if (quantity <= 0) {
                    return this.removeFromCart(productId);
                }
                item.quantity = quantity;
                this.setCart(cart);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error updating cart quantity:', error);
            return false;
        }
    }

    clearCart() {
        try {
            localStorage.removeItem(`${this.prefix}cart`);
            return true;
        } catch (error) {
            console.error('Error clearing cart:', error);
            return false;
        }
    }

    getCartCount() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + item.quantity, 0);
    }

    getCartTotal() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    addToWishlist(product) {
        try {
            let wishlist = this.getWishlist();
            if (!wishlist.find(item => item.id === product.id)) {
                wishlist.push(product);
                localStorage.setItem(
                    `${this.prefix}wishlist`,
                    JSON.stringify(wishlist)
                );
            }
            return true;
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            return false;
        }
    }

    getWishlist() {
        try {
            const wishlistData = localStorage.getItem(`${this.prefix}wishlist`);
            return wishlistData ? JSON.parse(wishlistData) : [];
        } catch (error) {
            console.error('Error retrieving wishlist:', error);
            return [];
        }
    }

    removeFromWishlist(productId) {
        try {
            const wishlist = this.getWishlist();
            const filtered = wishlist.filter(item => item.id !== productId);
            localStorage.setItem(
                `${this.prefix}wishlist`,
                JSON.stringify(filtered)
            );
            return true;
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            return false;
        }
    }

    isInWishlist(productId) {
        const wishlist = this.getWishlist();
        return wishlist.some(item => item.id === productId);
    }

    setFilters(filters) {
        try {
            localStorage.setItem(
                `${this.prefix}filters`,
                JSON.stringify(filters)
            );
            return true;
        } catch (error) {
            console.error('Error saving filters:', error);
            return false;
        }
    }

    getFilters() {
        try {
            const filterData = localStorage.getItem(`${this.prefix}filters`);
            return filterData ? JSON.parse(filterData) : {};
        } catch (error) {
            console.error('Error retrieving filters:', error);
            return {};
        }
    }

    addOrder(orderData) {
        try {
            let orders = this.getOrders();
            orders.push({
                ...orderData,
                id: Date.now(),
                date: new Date().toISOString()
            });
            localStorage.setItem(
                `${this.prefix}orders`,
                JSON.stringify(orders)
            );
            return true;
        } catch (error) {
            console.error('Error saving order:', error);
            return false;
        }
    }

    getOrders() {
        try {
            const ordersData = localStorage.getItem(`${this.prefix}orders`);
            return ordersData ? JSON.parse(ordersData) : [];
        } catch (error) {
            console.error('Error retrieving orders:', error);
            return [];
        }
    }

    clearAll() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.error('Error clearing storage:', error);
            return false;
        }
    }
}

export default new LocalStorageService();
