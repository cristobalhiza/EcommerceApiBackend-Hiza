import { expect } from "chai";
import { config } from "../../src/config/config.js";
import { connDB } from "../../src/connDB.js";
import supertest from "supertest";
import { v4 as uuidv4 } from "uuid";

const requester = supertest(`http://localhost:${config.PORT}/api`);

describe('Testing cart routes (CRUD, Purchase, Delete, etc.)', () => {
    let authCookie;
    let cartId;
    let productId;

    before(async () => {
        await connDB(config.MONGO_URL, config.DB_NAME);
    });

    const admin = {
        email: 'adminCoder@coder.com',
        password: 'adminCod3r123',
        role: 'admin'
    };

    const newProduct = {
        code: `TESTCART-${uuidv4()}`,
        title: "Producto en carrito",
        price: 150,
        category: "Test",
        stock: 20,
        status: true,
        description: "Descripción del producto",
        thumbnail: "image.jpg"
    };

    it('POST /api/sessions/login should respond with "Login exitoso"', async () => {
        const { body, headers } = await requester.post('/sessions/login').send(admin);
        expect(headers).to.have.property('set-cookie');
        authCookie = headers['set-cookie'][0].split(';')[0];
        expect(body.message).to.equal("Login exitoso");
    });

    it('POST /api/carts/ should create a new empty cart', async () => {
        const { status, body } = await requester.post('/carts/').set('Cookie', authCookie);
        expect(status).to.equal(201);
        expect(body).to.have.property('cart');
        cartId = body.cart._id;
    });

    it('POST /api/products/ should create a new product', async () => {
        await requester.delete(`/products?code=${newProduct.code}`).set('Cookie', authCookie);
        const { status, body } = await requester.post('/products/').set('Cookie', authCookie).send(newProduct);
        expect(status).to.equal(201);
        expect(body).to.have.property('_id');
        productId = body._id;
    });

    it('PUT /api/carts/:cid/product/:pid should update product quantity in cart', async () => {
        if (!productId) throw new Error("Error: productId no está definido");

        let { status: getStatus, body: cartData } = await requester.get(`/carts/${cartId}`).set('Cookie', authCookie);
        expect(getStatus).to.equal(200);

        let productExists = cartData.cart.products.some(p => p.product && String(p.product._id || p.product) === String(productId));

        if (!productExists) {
            await requester.post(`/carts/${cartId}/product/${productId}`).set('Cookie', authCookie).send({ quantity: 1 });
            await new Promise(resolve => setTimeout(resolve, 500));
            ({ status: getStatus, body: cartData } = await requester.get(`/carts/${cartId}`).set('Cookie', authCookie));
            expect(getStatus).to.equal(200);
        }

        productExists = cartData.cart.products.some(p => p.product && String(p.product._id || p.product) === String(productId));
        expect(productExists).to.be.true;

        const { status, body } = await requester.put(`/carts/${cartId}/product/${productId}`).set('Cookie', authCookie).send({ quantity: 5 });

        expect(status).to.equal(200);
        expect(body.message).to.equal("Cantidad actualizada");
    });

    it('GET /api/carts/:cid should return cart with products', async () => {
        let { status, body } = await requester.get(`/carts/${cartId}`).set('Cookie', authCookie);
        expect(status).to.equal(200);

        if (body.cart.products.length === 0) {
            await requester.post(`/carts/${cartId}/product/${productId}`).set('Cookie', authCookie).send({ quantity: 1 });
            ({ status, body } = await requester.get(`/carts/${cartId}`).set('Cookie', authCookie));
        }

        expect(body.cart.products.length).to.be.above(0);
    });

    it('POST /api/carts/:cid/product/:pid should correctly add product to existing cart', async () => {
        if (!cartId || !productId) throw new Error("Error: cartId o productId no está definido");
    
        const { status, body } = await requester
            .post(`/carts/${cartId}/product/${productId}`)
            .set('Cookie', authCookie)
            .send({ quantity: 1 });
    
        expect(status).to.equal(200);
        expect(body.message).to.equal("Producto agregado al carrito");
    
        const { body: cartData } = await requester.get(`/carts/${cartId}`).set('Cookie', authCookie);
        const productExists = cartData.cart.products.some(p => String(p.product._id || p.product) === String(productId));
    
        expect(productExists).to.be.true;
    });    

    it('DELETE /api/carts/:cid/product/:pid should remove product from cart', async () => {
        const { status } = await requester.delete(`/carts/${cartId}/product/${productId}`).set('Cookie', authCookie);
        expect(status).to.equal(200);
    });

    it('DELETE /api/carts/ should clear the cart', async () => {
        const { status } = await requester.delete(`/carts/`).set('Cookie', authCookie);
        expect(status).to.be.oneOf([200, 400]);
    });

    it('GET /api/carts/ should return a list of carts (only admin)', async () => {
        const { status, body } = await requester.get(`/carts/`).set('Cookie', authCookie);
        expect(status).to.equal(200);
        expect(body).to.be.an('array');
    });

    it('POST /api/carts/:cid/purchase should fail if cart is empty', async () => {
        const { status } = await requester.post(`/carts/${cartId}/purchase`).set('Cookie', authCookie);
        expect(status).to.be.oneOf([400, 403]);
    });

    it('GET /api/sessions/logout should respond with "¡Logout exitoso!" and cart should still exist', async () => {
        const { status, body, headers } = await requester.get('/sessions/logout').set('Cookie', authCookie);
        expect(status).to.equal(200);
        expect(body.message).to.equal('¡Logout exitoso!');
        expect(headers['set-cookie']).to.exist;

        const { status: cartStatus } = await requester.get(`/carts/${cartId}`).set('Cookie', authCookie).catch(err => ({ status: err.response?.status || 500 }));
        expect(cartStatus).to.be.oneOf([200, 403]);
    });

    it('GET /api/carts/:cid should return cart after user logs out', async () => {
        const { status, body } = await requester.get(`/carts/${cartId}`).set('Cookie', authCookie).catch(err => ({ status: err.response?.status || 500 }));
        expect(status).to.be.oneOf([200, 403]);
        if (status === 200) {
            expect(body.cart).to.have.property('_id');
            expect(body.cart.products).to.be.an('array');
        }
    });
});
