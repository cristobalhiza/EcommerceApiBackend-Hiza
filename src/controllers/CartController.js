// src/controllers/CartController.js

import { cartService } from '../repository/Cart.service.js';
import { isValidObjectId } from 'mongoose';
import { procesaErrores } from '../utils.js';

export class CartController {
    static async createEmptyCart(req, res) {
        try {
            const newCart = await cartService.getOrCreateCart();
            res.status(201).json({ message: 'Carrito creado', cart: newCart });
        } catch (error) {
            return procesaErrores(res, error);
        }
    }

    static async addProductToNewCart(req, res) {
        try {
            const { pid } = req.params;
            const { quantity } = req.body;

            if (!isValidObjectId(pid)) {
                return res.status(400).json({ error: 'El ID del producto no es válido' });
            }

            const parsedQuantity = parseInt(quantity) || 1;
            if (parsedQuantity <= 0) {
                return res.status(400).json({ error: 'La cantidad debe ser mayor que cero.' });
            }

            const cart = await cartService.getOrCreateCart();
            const updatedCart = await cartService.addProductToCart(cart._id, pid, parsedQuantity);
            res.status(201).json({ message: 'Producto agregado al nuevo carrito', cart: updatedCart });
        } catch (error) {
            return procesaErrores(res, error);
        }
    }

    static async addProductToExistingCart(req, res) {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;

            if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
                return res.status(400).json({ error: 'El ID del carrito o del producto no es válido' });
            }

            const parsedQuantity = parseInt(quantity) || 1;
            if (parsedQuantity <= 0) {
                return res.status(400).json({ error: 'La cantidad debe ser mayor que cero.' });
            }

            const updatedCart = await cartService.addProductToCart(cid, pid, parsedQuantity);
            res.status(200).json({ message: 'Producto agregado al carrito', cart: updatedCart });
        } catch (error) {
            return procesaErrores(res, error);
        }
    }

    static async updateCart(req, res) {
        try {
            const { cid } = req.params;
            const { products } = req.body;
    
            if (!isValidObjectId(cid)) {
                return res.status(400).json({ error: 'El ID del carrito no es válido' });
            }
    
            if (!Array.isArray(products) || products.length === 0) {
                return res.status(400).json({ error: 'El cuerpo de la solicitud debe incluir un array de productos' });
            }
    
            for (const product of products) {
                if (!isValidObjectId(product.productId) || typeof product.quantity !== 'number' || product.quantity <= 0) {
                    return res.status(400).json({ error: 'Cada producto debe tener un ID válido y una cantidad mayor que cero' });
                }
            }
    
            const updatedCart = await cartService.updateCart(cid, { products });
            res.status(200).json({ message: 'Carrito actualizado', cart: updatedCart });
        } catch (error) {
            return procesaErrores(res, error);
        }
    }

    static async updateProductQuantity(req, res) {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;

            if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
                return res.status(400).json({ error: 'El ID del carrito o producto no es válido' });
            }

            const parsedQuantity = parseInt(quantity);
            if (parsedQuantity <= 0) {
                return res.status(400).json({ error: 'La cantidad debe ser mayor que cero.' });
            }

            const updatedCart = await cartService.updateProductQuantity(cid, pid, parsedQuantity);
            res.status(200).json({ message: 'Cantidad actualizada', cart: updatedCart });
        } catch (error) {
            return procesaErrores(res, error);
        }
    }

    static async deleteProductFromCart(req, res) {
        try {
            const { cid, pid } = req.params;

            if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
                return res.status(400).json({ error: 'El ID del carrito o producto no es válido' });
            }

            const updatedCart = await cartService.deleteProductFromCart(cid, pid);
            res.status(200).json({ message: 'Producto eliminado del carrito', cart: updatedCart });
        } catch (error) {
            return procesaErrores(res, error);
        }
    }

    static async clearCart(req, res) {
        try {
            const { cid } = req.params;

            if (!isValidObjectId(cid)) {
                return res.status(400).json({ error: 'El ID del carrito no es válido' });
            }

            const clearedCart = await cartService.clearCart(cid);
            res.status(200).json({ message: 'Carrito vaciado correctamente', cart: clearedCart });
        } catch (error) {
            res.status(500).json({ error: 'No se pudo vaciar el carrito', message: error.message });
        }
    }

    static async getAllCarts(req, res) {
        try {
            const carts = await cartService.getAllCarts();
            res.status(200).json(carts);
        } catch (error) {
            return procesaErrores(res, error);
        }
    }

    static async getCartById(req, res) {
        try {
            const { cid } = req.params;

            if (!isValidObjectId(cid)) {
                return res.status(400).json({ error: 'El ID del carrito no es válido' });
            }

            const cart = await cartService.getOrCreateCart(cid);
            res.status(200).json({ cart });
        } catch (error) {
            return procesaErrores(res, error);
        }
    }
}