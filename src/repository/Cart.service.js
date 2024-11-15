import { CartManager } from '../dao/cartManager.js';
import ProductManager from '../dao/productManager.js';
import { usersModel } from '../dao/models/user.model.js';
import Cart from '../dao/models/cart.model.js';

class CartService {
    constructor(CartManager, productDAO) {
        this.CartManager = CartManager;
        this.productDAO = productDAO;
    }

    async getCartById(cartId) {
        const cart = await Cart.findById(cartId).populate('products.product');
        return cart;
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
    
        const cart = await this.CartManager.getCart(cartId);
    
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