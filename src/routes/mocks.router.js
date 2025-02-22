import { Router } from 'express';
import MocksController from '../controllers/MocksController.js';
import { auth } from '../middleware/auth.js';
import { passportCall } from '../utils/utils.js';

export const router = Router();

router.get('/:users/:products', passportCall('current'), auth('admin'), MocksController.createMockData);

export default router;
