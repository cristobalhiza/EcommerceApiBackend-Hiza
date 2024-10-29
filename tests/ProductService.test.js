// tests/ProductService.test.js
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

    test('createProduct lanza error si faltan campos obligatorios', async () => {
        const incompleteProduct = { title: 'Producto sin código' };

        await expect(productService.createProduct(incompleteProduct))
            .rejects
            .toThrow('Todos los campos requeridos deben completarse.');
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

    test('updateProduct actualiza el producto correctamente', async () => {
        const productUpdate = { title: 'Producto Actualizado' };
        ProductManager.update.mockResolvedValue(productUpdate);

        const result = await productService.updateProduct('1234', productUpdate);

        expect(result).toEqual(productUpdate);
        expect(ProductManager.update).toHaveBeenCalledWith('1234', productUpdate);
    });

    test('deleteProduct elimina el producto correctamente', async () => {
        ProductManager.delete.mockResolvedValue(true);

        const result = await productService.deleteProduct('1234');

        expect(result).toBe(true);
        expect(ProductManager.delete).toHaveBeenCalledWith('1234');
    });
    test('createProduct lanza error si el stock es negativo', async () => {
        const productData = {
            code: 'TEST123',
            title: 'Producto Negativo',
            price: 100,
            category: 'Categoría',
            stock: -5,
        };

        await expect(productService.createProduct(productData))
            .rejects
            .toThrow('El stock debe ser un número entero no negativo.');
    });

    test('createProduct lanza error si el precio es negativo', async () => {
        const productData = {
            code: 'TEST124',
            title: 'Producto Precio Negativo',
            price: -10,
            category: 'Categoría',
            stock: 5,
        };

        await expect(productService.createProduct(productData))
            .rejects
            .toThrow('El precio debe ser un número positivo.');
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

    test('updateProduct lanza error si se actualiza con stock negativo', async () => {
        const productUpdate = {
            stock: -10
        };

        await expect(productService.updateProduct('1234', productUpdate))
            .rejects
            .toThrow('El stock debe ser un número entero no negativo.');
    });

    test('createProduct lanza error si se envía un campo adicional no válido', async () => {
        const productData = {
            code: 'VALIDCODE',
            title: 'Producto Extra Campo',
            price: 50,
            category: 'Categoría',
            stock: 10,
            extraField: 'Este campo no es permitido'
        };

        await expect(productService.createProduct(productData))
            .rejects
            .toThrow('Todos los campos requeridos deben completarse.');
    });
    test('createProduct permite valores mínimos válidos', async () => {
        const productData = {
            code: 'MIN123',
            title: 'Producto Valor Mínimo',
            price: 0.01, 
            category: 'Categoría',
            stock: 0,
        };
    
        ProductManager.create.mockResolvedValue(productData);
    
        const result = await productService.createProduct(productData);
    
        expect(result).toEqual(productData);
        expect(ProductManager.create).toHaveBeenCalledWith(productData);
    });
    
    test('updateProduct lanza error si el producto no existe', async () => {
        const productUpdate = { title: 'Producto Inexistente' };
    
        ProductManager.update.mockResolvedValue(null); 
    
        await expect(productService.updateProduct('nonexistent_id', productUpdate))
            .rejects
            .toThrow('Producto no encontrado.');
    });
    
    test('deleteProduct lanza error si el producto no existe', async () => {
        ProductManager.delete.mockResolvedValue(null);
    
        await expect(productService.deleteProduct('nonexistent_id'))
            .rejects
            .toThrow('Producto no encontrado.');
    });
    
    test('createProduct lanza error si falla la base de datos', async () => {
        const productData = {
            code: 'DBFAIL123',
            title: 'Producto Fallo DB',
            price: 50,
            category: 'Categoría',
            stock: 10,
        };
    
        ProductManager.create.mockImplementation(() => {
            throw new Error('Error de conexión a la base de datos');
        });
    
        await expect(productService.createProduct(productData))
            .rejects
            .toThrow('Error creando producto: Error de conexión a la base de datos');
    });
});