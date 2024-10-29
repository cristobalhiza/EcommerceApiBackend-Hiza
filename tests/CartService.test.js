import { cartService } from '../src/services/Cart.service.js';
import CartManager from '../src/dao/cartManager.js';
import ProductManager from '../src/dao/productManager.js';

jest.mock('../src/dao/cartManager.js', () => ({
    addProductToCart: jest.fn(),
    getCart: jest.fn(),
    clearCart: jest.fn(),
    updateProductQuantity: jest.fn(),
    deleteProductFromCart: jest.fn(),
}));

jest.mock('../src/dao/productManager.js', () => ({
    getBy: jest.fn(),
}));

describe("CartService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("addProductToCart agrega el producto al carrito con la cantidad correcta", async () => {
        ProductManager.getBy.mockResolvedValue({ stock: 10 }); 
        CartManager.getCart.mockResolvedValue({
            _id: "cart123",
            products: []
        });
        CartManager.addProductToCart.mockResolvedValue({
            _id: "cart123",
            products: [{ product: "product123", quantity: 2 }]
        });
    
        const cart = await cartService.addProductToCart("cart123", "product123", 2);
    
        expect(cart).toEqual({
            _id: "cart123",
            products: [{ product: "product123", quantity: 2 }]
        });
        expect(CartManager.addProductToCart).toHaveBeenCalledWith("cart123", "product123", 2);
    });

    test("addProductToCart lanza error si la cantidad es inválida", async () => {
        await expect(cartService.addProductToCart("cart123", "product123", 0))
            .rejects
            .toThrow("La cantidad debe ser mayor que cero.");
    });

    test("getCart obtiene el carrito por ID", async () => {
        CartManager.getCart.mockResolvedValue({
            _id: "cart123",
            products: []
        });

        const cart = await cartService.getCart("cart123");

        expect(cart).toEqual({
            _id: "cart123",
            products: []
        });
        expect(CartManager.getCart).toHaveBeenCalledWith("cart123");
    });

    test("clearCart vacía el carrito correctamente", async () => {
        CartManager.clearCart.mockResolvedValue({
            _id: "cart123",
            products: []
        });

        const cart = await cartService.clearCart("cart123");

        expect(cart).toEqual({
            _id: "cart123",
            products: []
        });
        expect(CartManager.clearCart).toHaveBeenCalledWith("cart123");
    });

    test("updateProductQuantity actualiza la cantidad de un producto en el carrito", async () => {
        CartManager.updateProductQuantity.mockResolvedValue({
            _id: "cart123",
            products: [{ product: "product123", quantity: 5 }]
        });

        const cart = await cartService.updateProductQuantity("cart123", "product123", 5);

        expect(cart).toEqual({
            _id: "cart123",
            products: [{ product: "product123", quantity: 5 }]
        });
        expect(CartManager.updateProductQuantity).toHaveBeenCalledWith("cart123", "product123", 5);
    });

    test("updateProductQuantity lanza error si la cantidad es inválida", async () => {
        await expect(cartService.updateProductQuantity("cart123", "product123", 0))
            .rejects
            .toThrow("La cantidad debe ser mayor que cero.");
    });

    test("deleteProductFromCart elimina el producto del carrito", async () => {
        CartManager.deleteProductFromCart.mockResolvedValue({
            _id: "cart123",
            products: []
        });

        const cart = await cartService.deleteProductFromCart("cart123", "product123");

        expect(cart).toEqual({
            _id: "cart123",
            products: []
        });
        expect(CartManager.deleteProductFromCart).toHaveBeenCalledWith("cart123", "product123");
    });
});

describe("CartService - Validaciones Adicionales y Disponibilidad de Producto", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("addProductToCart lanza error si el producto no está disponible", async () => {
        ProductManager.getBy.mockResolvedValue({ stock: 0 });

        await expect(cartService.addProductToCart("cart123", "product123", 2))
            .rejects
            .toThrow("Producto no disponible.");
    });

    test("addProductToCart lanza error si el producto ya está en el carrito", async () => {
        ProductManager.getBy.mockResolvedValue({ stock: 10 }); 
        CartManager.getCart.mockResolvedValue({
            _id: "cart123",
            products: [{ product: "product123", quantity: 1 }]
        });

        await expect(cartService.addProductToCart("cart123", "product123", 2))
            .rejects
            .toThrow("El producto ya está en el carrito.");
    });

    test("addProductToCart lanza error si la cantidad excede el límite máximo", async () => {
        ProductManager.getBy.mockResolvedValue({ stock: 150 });

        await expect(cartService.addProductToCart("cart123", "product123", 101))
            .rejects
            .toThrow("La cantidad máxima permitida es 100.");
    });

    test("addProductToCart permite agregar el producto cuando está disponible y no excede el límite", async () => {
        ProductManager.getBy.mockResolvedValue({ stock: 150 }); 
        CartManager.getCart.mockResolvedValue({
            _id: "cart123",
            products: []
        });
        CartManager.addProductToCart.mockResolvedValue({
            _id: "cart123",
            products: [{ product: "product123", quantity: 5 }]
        });

        const cart = await cartService.addProductToCart("cart123", "product123", 5);

        expect(cart).toEqual({
            _id: "cart123",
            products: [{ product: "product123", quantity: 5 }]
        });
        expect(CartManager.addProductToCart).toHaveBeenCalledWith("cart123", "product123", 5);
    });
});