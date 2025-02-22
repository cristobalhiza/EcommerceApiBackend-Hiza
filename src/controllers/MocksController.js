import { faker } from '@faker-js/faker';
import { productService } from '../services/Product.service.js';
import { userService } from '../services/User.service.js';
import { cartService } from '../services/Cart.service.js';
import logger from '../utils/logger.util.js'; 

class MocksController {
    async createMockData(req, res, next) {
        try {

            const usersCount = Math.max(parseInt(req.params.users, 10));
            const maxProductsPerCart = Math.max(parseInt(req.params.products, 10)); 

            if (isNaN(usersCount) || isNaN(maxProductsPerCart) || usersCount <= 0 || maxProductsPerCart <= 0) {
                logger.WARN(`Parámetros inválidos: users=${req.params.users}, products=${req.params.products}`);
                return res.status(400).json({ error: 'Parámetros inválidos. Deben ser números mayores a 0.' });
            }

            logger.INFO(`Generando ${usersCount} usuarios con hasta ${maxProductsPerCart} productos en cada carrito.`);

            let allProducts = await productService.getProducts({}, { limit: maxProductsPerCart * usersCount });

            if (allProducts.docs.length < maxProductsPerCart) {
                const additionalProductsNeeded = maxProductsPerCart - allProducts.docs.length;
                logger.WARN(`Se generarán ${additionalProductsNeeded} productos adicionales para alcanzar el total solicitado.`);

                const additionalProducts = [];

                for (let i = 0; i < additionalProductsNeeded; i++) {
                    const newProduct = {
                        code: faker.string.alphanumeric(8),
                        title: faker.commerce.productName(),
                        description: faker.commerce.productDescription(),
                        price: parseFloat(faker.commerce.price({ min: 5, max: 500, dec: 2 })),
                        category: faker.commerce.department(),
                        stock: faker.number.int({ min: 5, max: 100 }),
                        status: true,
                        thumbnail: faker.image.url()
                    };

                    const createdProduct = await productService.createProduct(newProduct);
                    additionalProducts.push(createdProduct);
                }

                allProducts.docs = [...allProducts.docs, ...additionalProducts];
            }

            let mockUsers = [];

            for (let i = 0; i < usersCount; i++) {
                const newUser = {
                    first_name: faker.person.firstName(),
                    last_name: faker.person.lastName(),
                    email: faker.internet.email(),
                    age: faker.number.int({ min: 18, max: 60 }),
                    password: faker.internet.password(),
                    role: 'user'
                };

                const createdUser = await userService.createUser(newUser);
                const createdCart = await cartService.createCart({ userId: createdUser._id });

                const numProducts = faker.number.int({ min: 1, max: maxProductsPerCart });
                const selectedProducts = faker.helpers.arrayElements(allProducts.docs, numProducts).map(product => ({
                    product: product._id.toString(),
                    title: product.title,
                    price: product.price,
                    category: product.category,
                    quantity: faker.number.int({ min: 1, max: 10 }) 
                }));

                createdCart.products = selectedProducts;
                await createdCart.save();

                mockUsers.push({ user: createdUser, cart: createdCart });

                logger.INFO(`Usuario creado: ${createdUser.email} con ${selectedProducts.length} productos en el carrito.`);
            }

            logger.INFO(`Mock data generada exitosamente: ${usersCount} usuarios con sus carritos.`);
            res.status(201).json({ message: "Mock data created!", mockUsers });

        } catch (error) {
            logger.FATAL(`Error al generar datos ficticios: ${error.message}`);
            next(error);
        }
    }
}

export default new MocksController();