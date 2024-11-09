import { ProductService } from '../src/services/Product.service.js';
import ProductManager from '../src/dao/productManager.js';

jest.mock('../src/dao/productManager.js');

describe('ProductService', () => {
    let productService;

    beforeAll(() => {
        productService = new ProductService(ProductManager);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('getProducts devuelve productos con campo available', async () => {
        const mockProducts = [
            { stock: 5, title: 'Producto 1' },
            { stock: 0, title: 'Producto 2' },
        ];
        ProductManager.get.mockResolvedValue({ docs: mockProducts });

        const result = await productService.getProducts();

        expect(result).toEqual([
            { stock: 5, title: 'Producto 1', available: true },
            { stock: 0, title: 'Producto 2', available: false },
        ]);
        expect(ProductManager.get).toHaveBeenCalledTimes(1);
    });

    test('getProductBy devuelve null si no se encuentra un producto', async () => {
        ProductManager.getBy.mockResolvedValue(null);

        const result = await productService.getProductBy({ code: 'NOEXISTE' });

        expect(result).toBeNull();
        expect(ProductManager.getBy).toHaveBeenCalledWith({ code: 'NOEXISTE' });
    });

    test('getProductBy devuelve un producto con campo available', async () => {
        const mockProduct = { stock: 10, title: 'Producto Disponible' };
        ProductManager.getBy.mockResolvedValue(mockProduct);

        const result = await productService.getProductBy({ code: 'EXISTE' });

        expect(result).toEqual({ ...mockProduct, available: true });
        expect(ProductManager.getBy).toHaveBeenCalledWith({ code: 'EXISTE' });
    });

    test('createProduct lanza error si el código ya existe', async () => {
        ProductManager.create.mockImplementation(() => {
            const error = new Error();
            error.code = 11000;
            error.keyPattern = { code: 1 };
            throw error;
        });

        const productData = {
            code: 'EXISTENTE',
            title: 'Producto Duplicado',
            price: 10,
            category: 'Categoría',
            stock: 5,
        };

        await expect(productService.createProduct(productData))
            .rejects
            .toThrow('El código del producto ya existe, elija uno único.');
    });

    test('createProduct permite precio alto pero positivo', async () => {
        const productData = {
            code: 'HIGHPRICE',
            title: 'Producto Precio Alto',
            price: 1000000,
            category: 'Categoría',
            stock: 5,
        };

        ProductManager.create.mockResolvedValue(productData);

        const result = await productService.createProduct(productData);

        expect(result).toEqual(productData);
        expect(ProductManager.create).toHaveBeenCalledWith(productData);
    });

    test('updateProduct actualiza el producto correctamente', async () => {
        const productUpdate = { title: 'Producto Actualizado' };
        ProductManager.update.mockResolvedValue(productUpdate);

        const result = await productService.updateProduct('1234', productUpdate);

        expect(result).toEqual(productUpdate);
        expect(ProductManager.update).toHaveBeenCalledWith('1234', productUpdate);
    });

    test('updateProduct lanza error si el producto no existe', async () => {
        ProductManager.update.mockResolvedValue(null);

        await expect(productService.updateProduct('nonexistent_id', { title: 'Producto Inexistente' }))
            .rejects
            .toThrow('Producto no encontrado.');
    });

    test('deleteProduct elimina el producto correctamente', async () => {
        ProductManager.delete.mockResolvedValue(true);

        const result = await productService.deleteProduct('1234');

        expect(result).toBe(true);
        expect(ProductManager.delete).toHaveBeenCalledWith('1234');
    });

    test('deleteProduct lanza error si el producto no existe', async () => {
        ProductManager.delete.mockResolvedValue(null);

        await expect(productService.deleteProduct('nonexistent_id'))
            .rejects
            .toThrow('Producto no encontrado.');
    });

    test('createProduct lanza error si falla la base de datos', async () => {
        ProductManager.create.mockImplementation(() => {
            throw new Error('Error de conexión a la base de datos');
        });

        const productData = {
            code: 'DBFAIL123',
            title: 'Producto Fallo DB',
            price: 50,
            category: 'Categoría',
            stock: 10,
        };

        await expect(productService.createProduct(productData))
            .rejects
            .toThrow('Error creando producto: Error de conexión a la base de datos');
    });
});