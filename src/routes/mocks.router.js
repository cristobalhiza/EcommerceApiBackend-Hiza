import { Router } from 'express';
import MocksController from '../controllers/MocksController.js';
import { auth } from '../middleware/auth.js';

export const router = Router();

router.get('/:users/:products', auth('admin'), MocksController.createMockData);

export default router;
