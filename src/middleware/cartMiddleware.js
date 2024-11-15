import { cartService } from '../repository/Cart.service.js';

export const cartMiddleware = async (req, res, next) => {
    try {
        let cartId = req.cookies.cartId || req.user?.cart; // Suponiendo que cart es un campo en el modelo de usuario

        if (!cartId) {
            const cart = await cartService.getOrCreateCart();
            cartId = cart._id;
            res.cookie('cartId', cartId, { httpOnly: true, maxAge: 3600000 * 12 });
        } else {
            // Si el usuario está autenticado y tiene un carrito, actualizarlo si es necesario
            if (req.user) {
                const cart = await cartService.findById(cartId);
                // ... lógica para actualizar el carrito con los productos del carrito temporal
                await cart.save();
            }
        }

        req.cartId = cartId;
        next();
    } catch (error) {
        console.error('Error en el middleware del carrito:', error);
        res.status(500).json({ message: 'Error al procesar el carrito' });
    }
};