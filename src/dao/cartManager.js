import mongoose from 'mongoose';
import Cart from './models/cartsModel.js';

export class CartsManager {
    static async addProductToCart(cartId, productId, quantity) {
        try {
            if (quantity <= 0) {
                throw new Error('La cantidad debe ser mayor que cero.');
            }

            if (!mongoose.Types.ObjectId.isValid(cartId)) {
                throw new Error('El ID del carrito no es válido.');
            }
            if (!mongoose.Types.ObjectId.isValid(productId)) {
                throw new Error('El ID del producto no es válido.');
            }

            // Buscar carrito
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado.');
            }

            const existingProduct = cart.products.find(p =>
                p.product && p.product.equals(productId)
            );

            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }

            await cart.save();
            await cart.populate('products.product');
            return cart;
        } catch (error) {
            throw new Error('Error agregando producto al carrito: ' + error.message);
        }
    }

    static async deleteProductFromCart(cartId, productId) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado.');
            }
            cart.products = cart.products.filter(p => !p.product.equals(mongoose.Types.ObjectId.createFromHexString(productId)));
            await cart.save();
            await cart.populate('products.product');
            return cart;
        } catch (error) {
            throw new Error('Error eliminando producto del carrito: ' + error.message);
        }
    }

    static async getCart(cartId) {
        try {
            const cart = await Cart.findById(cartId).populate('products.product').lean();
            if (!cart) {
                throw new Error('Carrito no encontrado.');
            }
            return cart;
        } catch (error) {
            throw new Error('Error obteniendo carrito: ' + error.message);
        }
    }

    static async getAllCarts() {
        try {
            const carts = await Cart.find().lean(); //si necesita ver detalle productos usar .populate('products.product') en principio no parece necesaria tanta información
            return carts;
        } catch (error) {
            throw new Error('Error obteniendo carritos: ' + error.message);
        }
    }

    static async clearCart(cartId) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado.');
            }
            cart.products = [];
            await cart.save();
            await cart.populate('products.product');
            return cart;
        } catch (error) {
            throw new Error('Error vaciando carrito: ' + error.message);
        }
    }

    static async updateProductQuantity(cartId, productId, quantity) {
        const cart = await Cart.findById(cartId);
        if (!cart) throw new Error('Carrito no encontrado.');

        const productInCart = cart.products.find(p => p.product.equals(mongoose.Types.ObjectId.createFromHexString(productId)));

        if (!productInCart) throw new Error('Producto no encontrado en el carrito.');

        productInCart.quantity = quantity;
        await cart.save();

        await cart.populate('products.product');

        return cart;
    }

    static async create() {
        return await Cart.create({ products: [] })
    }

    static async update(id, cart) {
        return await Cart.updateOne({ _id: id }, cart)
    }
}


