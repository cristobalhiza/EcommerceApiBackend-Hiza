// src/routes/apiCarts.router.js
import { Router } from 'express';
import { CartController } from '../controllers/CartController.js';
import { cartMiddleware } from '../middleware/cartMiddleware.js';
import { auth } from '../middleware/auth.js';
import { passportCall } from '../utils.js';

export const router = Router();

router.use(cartMiddleware);

router.post('/', CartController.createEmptyCart);

router.post('/create/product/:pid', CartController.addProductToNewCart);

router.post('/:cid/product/:pid', CartController.addProductToExistingCart);

router.put('/:cid', CartController.updateCart);

router.put('/:cid/product/:pid', CartController.updateProductQuantity);

router.delete('/:cid/product/:pid', CartController.deleteProductFromCart);

router.delete('/:cid', CartController.clearCart);

router.get('/', passportCall('current'), auth('admin'), CartController.getAllCarts);

router.get('/:cid', CartController.getCartById);
