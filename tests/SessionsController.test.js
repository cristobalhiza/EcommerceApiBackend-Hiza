import { SessionsController } from '../src/controllers/SessionsController.js';
import { cartService } from '../src/services/Cart.service.js';

jest.mock('../src/services/Cart.service.js', () => ({
    cartService: {
        linkCartToUser: jest.fn()
    }
}));

describe('SessionsController', () => {
    let req, res;

    beforeEach(() => {
        req = {
            cookies: {},
            user: { _id: 'userId', role: 'user', first_name: 'John' },
            body: { userId: 'userId', cartId: 'cartId' },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            cookie: jest.fn(),
            clearCookie: jest.fn(),
            setHeader: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('registro', () => {
        it('debería vincular carrito y limpiar cookie si el usuario tiene rol "user"', async () => {
            req.cookies.cartId = 'cartId';

            cartService.linkCartToUser.mockResolvedValueOnce({ _id: 'cartId', userId: 'userId' });

            await SessionsController.registro(req, res);

            expect(cartService.linkCartToUser).toHaveBeenCalledWith('cartId', 'userId');
            expect(res.clearCookie).toHaveBeenCalledWith('cartId');
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                payload: expect.stringContaining('Registro exitoso para John')
            }));
        });

        it('no debería intentar vincular carrito si el rol no es "user"', async () => {
            req.user = { _id: 'adminId', role: 'admin', first_name: 'Admin' };

            await SessionsController.registro(req, res);

            expect(cartService.linkCartToUser).not.toHaveBeenCalled();
            expect(res.clearCookie).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                payload: expect.stringContaining('Registro exitoso para Admin')
            }));
        });
    });

    describe('login', () => {
        it('debería vincular carrito y limpiar cookie si el usuario tiene rol "user"', async () => {
            req.cookies.cartId = 'cartId';
            cartService.linkCartToUser.mockResolvedValueOnce({ _id: 'cartId', userId: 'userId' });

            await SessionsController.login(req, res);

            expect(cartService.linkCartToUser).toHaveBeenCalledWith('cartId', 'userId');
            expect(res.clearCookie).toHaveBeenCalledWith('cartId');
            expect(res.cookie).toHaveBeenCalledWith('tokenCookie', expect.any(String), { httpOnly: true });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                payload: expect.stringContaining('Login exitoso para John')
            }));
        });

        it('no debería intentar vincular carrito si el rol no es "user"', async () => {
            req.user = { _id: 'adminId', role: 'admin', first_name: 'Admin' };

            await SessionsController.login(req, res);

            expect(cartService.linkCartToUser).not.toHaveBeenCalled();
            expect(res.clearCookie).not.toHaveBeenCalled();
            expect(res.cookie).toHaveBeenCalledWith('tokenCookie', expect.any(String), { httpOnly: true });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                payload: expect.stringContaining('Login exitoso para Admin')
            }));
        });
    });
});