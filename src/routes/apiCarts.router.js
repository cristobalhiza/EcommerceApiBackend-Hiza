// src/routes/apiCarts.router.js
import { Router } from 'express';
import { CartController } from '../controllers/CartController.js';
import { cartMiddleware } from '../middlewares/cartMiddleware.js';

const router = Router();

router.use(cartMiddleware);

router.post('/', CartController.createEmptyCart);

router.post('/create/product/:pid', CartController.addProductToNewCart);

router.post('/:cid/product/:pid', CartController.addProductToExistingCart);

router.put('/:cid', CartController.updateCart);

router.put('/:cid/product/:pid', CartController.updateProductQuantity);

router.delete('/:cid/product/:pid', CartController.deleteProductFromCart);

router.delete('/:cid', CartController.clearCart);

router.get('/', CartController.getAllCarts);

router.get('/:cid', CartController.getCartById);

export default router;