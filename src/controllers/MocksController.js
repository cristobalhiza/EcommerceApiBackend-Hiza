import { productService } from '../services/Product.service.js';
import { userService } from '../services/User.service.js';

class MocksController {
    async createMockData(req, res, next) {
        try {
            const usersCount = parseInt(req.params.users, 10);
            const productsCount = parseInt(req.params.products, 10);

            if (isNaN(usersCount) || isNaN(productsCount)) {
                return next(createError(400, 'Parámetros inválidos'))
            }

            const users = await userService.createMockUsers(usersCount);
            const products = await productService.createMockProducts(productsCount);

            res.status(201).json({ message: "Mock data created!", users, products });
        } catch (error) {
            next(error);
        }
    }
}

export default new MocksController();
