import { expect } from "chai";
import { config } from "../../src/config/config.js";
import { connDB } from "../../src/connDB.js";
import supertest from "supertest";

const requester = supertest(`http://localhost:${config.PORT}/api`);

describe('Testing admin login, products CRUD, logout', () => {
    let authCookie;
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
        code: "TEST123",
        title: "Producto de prueba",
        price: 100,
        category: "Test",
        stock: 10,
        status: true,
        description: "Descripción de prueba",
        thumbnail: "image.jpg"
    };

    it('POST /api/sessions/login should respond with "Login exitoso"', async () => {
        const { body, headers } = await requester.post('/sessions/login').send(admin);
        expect(headers).to.have.property('set-cookie');
        authCookie = headers['set-cookie'][0].split(';')[0];
        expect(body.message).to.equal("Login exitoso");
    });

    it('POST /api/products/ should respond with a new product of type object', async () => {
        const response = await requester
        .post('/products/')
        .set('Cookie', authCookie)
        .send(newProduct);
        
        expect(response.body).to.have.property('_id');
        productId = response.body._id;
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('code', newProduct.code).and.to.be.a('string');
        expect(response.body).to.have.property('title', newProduct.title).and.to.be.a('string');
        expect(response.body).to.have.property('price', newProduct.price).and.to.be.a('number');
        expect(response.body).to.have.property('stock', newProduct.stock).and.to.be.a('number');
        expect(response.body).to.have.property('category', newProduct.category).and.to.be.a('string');
    });

    it('GET /api/products/:pid should respond with product object and 200 status code', async () => {
        const { status, body } = await requester
            .get(`/products/${productId}`)  
            .set('Cookie', authCookie);
        
        expect(body).to.be.an('object');
        expect(status).to.equal(200);
        expect(body).to.have.property('title', newProduct.title);
    });
    

    it('PUT /api/products/:pid should respond with a diferent product', async () => {
        const { body } = await requester.get(`/products/${productId}`).set('Cookie', authCookie);
        const oldPrice = body.price;
        const updatedProduct = { ...newProduct, price: 150 };
        const { body: body2, status } = await requester
        .put(`/products/${productId}`)
        .set('Cookie', authCookie)
        .send(updatedProduct);

        expect(oldPrice).not.to.equal(body2.price);
        expect(status).to.equal(200);
    });

    it('GET /api/products/ should return a list of products', async () => {
        const { status, body } = await requester
            .get(`/products/`)
            .set('Cookie', authCookie);
        
        expect(status).to.equal(200);
        expect(body).to.be.an('object');
        expect(body).to.have.property('products').that.is.an('array');
    });

    it('GET /api/products/:pid should return 400 for an invalid product ID', async () => {
        const { status, body } = await requester
            .get(`/products/invalidID`)
            .set('Cookie', authCookie);
        
        expect(status).to.equal(400);
        expect(body).to.have.property('error').that.includes("El ID del producto no es válido");
    });

    it('POST /api/products/ should return 400 for missing required fields', async () => {
        const { status, body } = await requester
            .post('/products/')
            .set('Cookie', authCookie)
            .send({ title: "Producto sin precio" }); 
        
        expect(status).to.equal(400);
        expect(body).to.have.property('error').that.includes("Faltan campos obligatorios");
    });

    it('DELETE /api/products/:pid should respond with 200 status code', async () => {
        const response = await requester
            .delete(`/products/${productId}`)
            .set('Cookie', authCookie);
        
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('message').that.includes("eliminado correctamente");
    });

    it('GET /api/sessions/logout should respond with "¡Logout exitoso!" and product should not exist', async () => {
        const { status, body, headers } = await requester.get('/sessions/logout').set('Cookie', authCookie);
        
        expect(status).to.equal(200);
        expect(body.message).to.equal('¡Logout exitoso!');
        expect(headers['set-cookie']).to.exist;
        
        const { status: productStatus } = await requester.get(`/products/${productId}`).set('Cookie', authCookie);
        
        expect(productStatus).to.equal(404);
    });
    
});
