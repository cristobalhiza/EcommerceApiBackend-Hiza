import { cartService } from '../repository/Cart.service.js';

export const cartMiddleware = async (req, res, next) => {
    let cartId = req.cookies.cartId || req.user?.cartId

    if (!cartId) {
        const cart = await cartService.createCart();
        cartId = cart._id;
        res.cookie('cartId', cartId, { httpOnly: true, maxAge: 3600000*12 }); //12h
}
    req.cartId = cartId;
    next();
};