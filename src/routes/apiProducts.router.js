// src/routes/apiProducts.router.js
import { Router } from 'express';
import ProductsController from '../controllers/ProductsController.js';
import { auth } from '../middleware/auth.js';
import { passportCall } from '../utils.js';

export const router = Router();

router.get('/', ProductsController.getProducts);
router.get('/:id', ProductsController.getProductById);
router.post('/', passportCall('current'), auth('admin'), ProductsController.createProduct);
router.put('/:id', passportCall('current'), auth('admin'), ProductsController.updateProduct);
router.delete('/:id', passportCall('current'), auth('admin'), ProductsController.deleteProduct);

