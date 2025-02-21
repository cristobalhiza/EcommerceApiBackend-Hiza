import assert from 'assert';
import { describe, it, before, after } from 'mocha';
import { productService } from '../src/services/Product.service.js';
import { connDB } from '../src/connDB.js';
import { config } from '../src/config/config.js';
import Product from '../src/dao/models/product.model.js';

describe('Product Service Tests', () => {
  let createdProduct = null;

  before(async () => {
    await connDB(config.MONGO_URL, config.DB_NAME);
    await Product.deleteMany({});
  });

  after(async () => {
    await Product.deleteMany({});
  });

  it('should create a product with an automatically generated code and an id', async () => {
    const data = {
      title: 'Test Product Create',
      category: 'Test',
      price: 100,
      stock: 10
    };

    const product = await productService.createProduct(data);
    createdProduct = product;

    assert.ok(product.id, 'The product should have an _id');
    assert.ok(product.code, 'The product should have an automatically generated code');

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    assert.ok(uuidRegex.test(product.code), 'The code should be a valid UUID');
  });

  it('should retrieve the created product by its id', async () => {
    const product = await productService.getProductBy({ _id: createdProduct.id });
    assert.ok(product, 'The product should be found');
    assert.strictEqual(product.title, 'Test Product Create', 'The product title should match');
  });

  it('should update the product title and stock', async () => {
    const updatedData = {
      title: 'Updated Product Title',
      stock: 20
    };

    const updatedProduct = await productService.updateProduct(createdProduct.id, updatedData);
    assert.ok(updatedProduct, 'The product should be updated');
    assert.strictEqual(updatedProduct.title, 'Updated Product Title', 'The product title should update correctly');
    assert.strictEqual(updatedProduct.stock, 20, 'The product stock should update correctly');
  });

  it('should throw an error when trying to update product with negative stock', async () => {
    try {
      await productService.updateProduct(createdProduct.id, { stock: -5 });
      assert.fail('An error should be thrown for negative stock');
    } catch (error) {
      assert.ok(
        error.message.includes('The product stock cannot be negative'),
        'The error message should indicate that the stock cannot be negative'
      );
    }
  });

  it('should delete the product successfully', async () => {
    const deletedProduct = await productService.deleteProduct(createdProduct.id);
    assert.ok(deletedProduct, 'The product should be deleted');

    const productAfterDelete = await productService.getProductBy({ _id: createdProduct.id });
    assert.strictEqual(productAfterDelete, null, 'The product should not exist after deletion');
  });

  it('should create a mock product successfully', async () => {
    const mockProduct = await productService.createMockProduct();
    assert.ok(mockProduct, 'The mock product should be created');
    assert.ok(mockProduct.id, 'The mock product should have an _id');
    assert.ok(mockProduct.code, 'The mock product should have an automatically generated code');
  });

  it('should create multiple mock products successfully', async () => {
    const quantity = 5;
    const mockProducts = await productService.createMockProducts(quantity);
    assert.strictEqual(mockProducts.length, quantity, 'The specified number of mock products should be created');

    mockProducts.forEach((mockProduct) => {
      assert.ok(mockProduct.title, 'Each mock product should have a title');
      assert.ok(mockProduct.code, 'Each mock product should have an automatically generated code');
    });
  });

  it('should return a paginated result with a docs array (limit 5 items) and valid metadata for page 1', async () => {
    const createPromises = [];
    for (let i = 0; i < 10; i++) {
      createPromises.push(productService.createProduct({
        title: `Paginated Product ${i}`,
        category: 'Paginated',
        price: 50 + i,
        stock: 10 + i
      }));
    }
    await Promise.all(createPromises);

    const filter = { category: { $regex: new RegExp('Paginated', 'i') } };
    const options = { limit: 5, page: 1 };
    const result = await productService.getProducts(filter, options);

    assert.ok(Array.isArray(result.docs), 'The result should be an array of products');
    assert.ok(result.docs.length <= 5, 'It should retrieve at most 5 products');
    assert.strictEqual(result.page, 1, 'The page should be 1');
    assert.ok(typeof result.totalPages === 'number', 'ptotalPages should be a number');
  });

  it('should throw an error if required fields are missing', async () => {
    const data = {
      description: 'Missing required fields'
    };
    try {
      await productService.createProduct(data);
      assert.fail('An error should be thrown when required fields are missing');
    } catch (error) {
      assert.ok(
        error.message.includes('Error creating product'),
        'The error message should indicate that required fields are missing'
      );
    }
  });
});
