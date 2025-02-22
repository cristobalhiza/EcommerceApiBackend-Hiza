import { Router } from 'express';
import ProductsController from '../controllers/ProductsController.js';
import { auth } from '../middleware/auth.js';
import { passportCall } from '../utils/utils.js';

export const router = Router();

router.get('/', ProductsController.getProducts);
router.get('/:id', ProductsController.getProductById);
router.use(passportCall('current'));
router.post('/', auth('admin'), ProductsController.createProduct);
router.put('/:id', auth('admin'), ProductsController.updateProduct);
router.delete('/:id', auth('admin'), ProductsController.deleteProduct);