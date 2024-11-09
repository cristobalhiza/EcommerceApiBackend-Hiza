import { cartService } from '../src/services/Cart.service.js';
import { CartManager } from '../src/dao/cartManager.js';
import { usersModel } from '../src/dao/models/user.model.js';
import ProductManager from '../src/dao/productManager.js';

jest.mock('../src/dao/cartManager.js');
jest.mock('../src/dao/models/user.model.js');
jest.mock('../src/dao/productManager.js');

describe('CartService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getOrCreateCart', () => {
        it('debería crear un nuevo carrito si no existe uno', async () => {
            CartManager.getCart.mockResolvedValue(null);
            CartManager.create.mockResolvedValue({ _id: 'newCartId' });

            const cart = await cartService.getOrCreateCart(null);

            expect(CartManager.create).toHaveBeenCalled();
            expect(cart).toEqual({ _id: 'newCartId' });
        });

        it('debería retornar el carrito existente si el cartId existe', async () => {
            CartManager.getCart.mockResolvedValue({ _id: 'existingCartId' });

            const cart = await cartService.getOrCreateCart('existingCartId');

            expect(CartManager.getCart).toHaveBeenCalledWith('existingCartId');
            expect(cart).toEqual({ _id: 'existingCartId' });
        });
    });

    describe('linkCartToUser', () => {
        it('debería vincular el carrito a un usuario con rol "user"', async () => {
            const userId = 'userId';
            const cartId = 'cartId';

            usersModel.findById.mockResolvedValue({ _id: userId, role: 'user' });
            CartManager.getCart.mockResolvedValue({ _id: cartId, userId: null, save: jest.fn() });

            const cart = await cartService.linkCartToUser(cartId, userId);

            expect(usersModel.findById).toHaveBeenCalledWith(userId);
            expect(cart.userId).toBe(userId);
        });

        it('debería lanzar un error si el usuario no tiene rol "user"', async () => {
            const userId = 'adminId';
            const cartId = 'cartId';

            usersModel.findById.mockResolvedValue({ _id: userId, role: 'admin' });
            CartManager.getCart.mockResolvedValue({ _id: cartId, userId: null });

            await expect(cartService.linkCartToUser(cartId, userId)).rejects.toThrow('Solo los usuarios con rol "user" pueden tener un carrito asignado');
        });
    });

    describe('addProductToCart', () => {
        it('debería lanzar un error si el producto no tiene stock disponible', async () => {
            const cartId = 'cartId';
            const productId = 'productId';
            const quantity = 5;

            ProductManager.getBy.mockResolvedValue({ _id: productId, stock: 0 });
            CartManager.getCart.mockResolvedValue({ _id: cartId, products: [] });

            await expect(cartService.addProductToCart(cartId, productId, quantity)).rejects.toThrow('Producto no disponible.');
        });

        it('debería lanzar un error si la cantidad excede el stock disponible', async () => {
            const cartId = 'cartId';
            const productId = 'productId';
            const quantity = 15;

            ProductManager.getBy.mockResolvedValue({ _id: productId, stock: 10 });
            CartManager.getCart.mockResolvedValue({ _id: cartId, products: [] });

            await expect(cartService.addProductToCart(cartId, productId, quantity)).rejects.toThrow('La cantidad solicitada excede el stock disponible.');
        });

        it('debería agregar un producto al carrito si la cantidad es válida y hay stock suficiente', async () => {
            const cartId = 'cartId';
            const productId = 'productId';
            const quantity = 5;

            ProductManager.getBy.mockResolvedValue({ _id: productId, stock: 10 });
            CartManager.getCart.mockResolvedValue({ _id: cartId, products: [] });
            CartManager.addProductToCart.mockResolvedValue({ _id: cartId, products: [{ product: productId, quantity }] });

            const updatedCart = await cartService.addProductToCart(cartId, productId, quantity);

            expect(ProductManager.getBy).toHaveBeenCalledWith({ _id: productId });
            expect(CartManager.getCart).toHaveBeenCalledWith(cartId);
            expect(CartManager.addProductToCart).toHaveBeenCalledWith(cartId, productId, quantity);
            expect(updatedCart.products).toContainEqual({ product: productId, quantity });
        });
    });
});