import Cart from './models/cart.model.js';
import createLogger from '../utils/logger.util.js';

export class CartManager {
    static async create() {
        return await Cart.create({ products: [] });
    }

    static async getCart(cartId) {
        const cart = await Cart.findById(cartId).populate('products.product');
        return cart;
    }

    static async getAllCarts() {
        return await Cart.find().populate('products.product');
    }

    static async update(filtro, cartData) {
        if (typeof filtro === "string") {
            filtro = { _id: filtro };
        }
        return await Cart.updateOne(filtro, cartData);
    }

    static async clearCart(cartId) {
        const cart = await Cart.findById(cartId);
        if (!cart) {
            createLogger.WARN("Carrito no encontrado en la base de datos.");
            return null;
        }
        cart.products = [];
        await cart.save();
        return cart;
    }

    static async deleteProductFromCart(cartId, productId) {
        const cart = await this.getCart(cartId);
        cart.products = cart.products.filter(p => !p.product.equals(productId));
        await cart.save();
        return cart;
    }
}