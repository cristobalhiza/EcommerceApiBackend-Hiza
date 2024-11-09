import { CartManager } from '../dao/cartManager.js';
import ProductManager from '../dao/productManager.js';
import { usersModel } from '../dao/models/user.model.js';

class CartService {
    constructor(CartManager, productDAO) {
        this.CartManager = CartManager;
        this.productDAO = productDAO;
    }

    async getOrCreateCart(cartId) {
        let cart = cartId ? await this.CartManager.getCart(cartId) : null;
        if (!cart) {
            cart = await this.CartManager.create();
        }
        return cart;
    }

    async linkCartToUser(cartId, userId) {
        const user = await usersModel.findById(userId);
        if (!user || user.role !== 'user') {
            throw new Error('Solo los usuarios con rol "user" pueden tener un carrito asignado.');
        }

        const cart = await this.CartManager.getCart(cartId);
        if (cart && !cart.userId) {
            cart.userId = userId;
            await cart.save();
        }
        return cart;
    }

    async addProductToCart(cartId, productId, quantity) {
        const product = await this.productDAO.getBy({ _id: productId });
        if (!product || product.stock <= 0) {
            throw new Error('Producto no disponible.');
        }
    
        if (quantity > product.stock) {
            throw new Error('La cantidad solicitada excede el stock disponible.');
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

    async getAllCarts() {
        return await this.CartManager.getAllCarts();
    }

    async clearCart(cartId) {
        return await this.CartManager.clearCart(cartId);
    }

    async updateProductQuantity(cartId, productId, quantity) {
        return await this.CartManager.updateProductQuantity(cartId, productId, quantity);
    }

    async updateCart(id, cartData) {
        return await this.CartManager.update(id, cartData);
    }
}

export const cartService = new CartService(CartManager, ProductManager);