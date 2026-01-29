class APIService {
    constructor() {
        this.fakeStoreAPI = 'https://fakestoreapi.com/products';
        this.cache = new Map();
    }

    async fetchProducts(params = {}) {
        try {
            const cacheKey = JSON.stringify(params);
            if (this.cache.has(cacheKey)) {
                return this.cache.get(cacheKey);
            }

            const response = await fetch(this.fakeStoreAPI);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            const products = data.map(product => ({
                ...product,
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                category: product.category,
                rating: {
                    rate: (Math.random() * 2 + 3).toFixed(1),
                    count: Math.floor(Math.random() * 500 + 50)
                },
                description: product.description,
                inStock: Math.random() > 0.2 // 80% in stock
            }));

            this.cache.set(cacheKey, products);
            return products;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }

    async fetchProductById(id) {
        try {
            const products = await this.fetchProducts();
            const product = products.find(p => p.id === parseInt(id));
            
            if (!product) {
                throw new Error(`Product with id ${id} not found`);
            }

            return product;
        } catch (error) {
            console.error('Error fetching product:', error);
            throw error;
        }
    }

    async searchProducts(query) {
        try {
            const products = await this.fetchProducts();
            return products.filter(product => 
                product.title.toLowerCase().includes(query.toLowerCase()) ||
                product.description.toLowerCase().includes(query.toLowerCase())
            );
        } catch (error) {
            console.error('Error searching products:', error);
            throw error;
        }
    }
}

export default new APIService();
