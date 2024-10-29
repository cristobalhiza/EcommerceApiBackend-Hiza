import CartManager from '../dao/cartManager.js';
import ProductManager from '../dao/productManager.js';

class CartService {
    constructor(CartManager, productDAO) {
        this.CartManager = CartManager;
        this.productDAO = productDAO;
    }

    async addProductToCart(cartId, productId, quantity) {
        if (quantity <= 0) {
            throw new Error('La cantidad debe ser mayor que cero.');
        }

        if (quantity > 100) {
            throw new Error('La cantidad máxima permitida es 100.');
        }

        const product = await this.productDAO.getBy({ _id: productId });
        if (!product || product.stock <= 0) {
            throw new Error('Producto no disponible.');
        }

        const cart = await this.CartManager.getCart(cartId);
        const existingProduct = cart.products.find(p => p.product.toString() === productId);

        if (existingProduct) {
            throw new Error('El producto ya está en el carrito.');
        }

        return await this.CartManager.addProductToCart(cartId, productId, quantity);
    }

    async deleteProductFromCart(cartId, productId) {
        return await this.CartManager.deleteProductFromCart(cartId, productId);
    }

    async getCart(cartId) {
        return await this.CartManager.getCart(cartId);
    }

    async getAllCarts() {
        return await this.CartManager.getAllCarts();
    }

    async clearCart(cartId) {
        return await this.CartManager.clearCart(cartId);
    }

    async updateProductQuantity(cartId, productId, quantity) {
        if (quantity <= 0) {
            throw new Error('La cantidad debe ser mayor que cero.');
        }
        return await this.CartManager.updateProductQuantity(cartId, productId, quantity);
    }

    async createCart() {
        return await this.CartManager.create();
    }

    async updateCart(id, cartData) {
        return await this.CartManager.update(id, cartData);
    }
}

export const cartService = new CartService(CartManager, ProductManager);