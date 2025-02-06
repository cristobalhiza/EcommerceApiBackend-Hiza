import { Router } from 'express';
import MocksController from '../controllers/MocksController.js';

export const router = Router();

router.get('/:users/:products', MocksController.createMockData);

export default router;
