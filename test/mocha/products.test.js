import assert from 'assert';
import { describe, it } from 'mocha';
import { productService } from '../../src/services/Product.service.js';
import { connDB } from '../../src/connDB.js';
import { config } from '../../src/config/config.js';


describe(
    'Testing Product Service',
    () => {
        before(
            async () => {
                await connDB(config.MONGO_URL, config.DB_NAME);
            }
        )
        it(
            'Create product should return a product that includes and _id property',
            async () => {

                const data = {
                    code: '1234',
                    title: 'Test Product',
                    category: 'Test',
                    price: 100,
                    stock: 10
                };
                const product = await productService.createProduct(data);
                assert.ok(product._id);
            }
        );
    }
)