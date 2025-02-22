import { expect } from "chai";
import { config } from "../../src/config/config.js";
import { connDB } from "../../src/connDB.js";
import supertest from "supertest";
import { userService } from "../../src/services/User.service.js";
import createLogger from "../../src/utils/logger.util.js";

const requester = supertest(`http://localhost:${config.PORT}/api`);

describe('Auth Testing', () => {
    before(async () => {
        await connDB(config.MONGO_URL, config.DB_NAME);
    });

    const user = {
        email: 'supertest@test.com',
        password: '12345678'
    };

    let userId;
    let authCookie;

    it('POST /api/sessions/registro should respond with failure and 400 status code if required fields are missing', async () => {
        try {
            const { status } = await requester.post('/sessions/registro').send({});
            expect(status).to.equal(400);
        } catch (error) {
            createLogger.WARN("Error during missing fields test: " + error.message);
            throw error;
        }
    });
    
    

    it('POST /api/sessions/registro should respond with success and 201 status code', async () => {
        try {
            const { status, body } = await requester.post('/sessions/registro').send(user);
            expect(status).to.equal(201);
            expect(body).to.have.property('nuevoUsuario');
            userId = body.nuevoUsuario._id;
        } catch (error) {
            createLogger.WARN("Error during registration: " + error.message);
            throw error;
        }
    });

    it('POST /api/sessions/registro should respond with 400 status code if user already exists', async () => {
        try {
            const { status } = await requester.post('/sessions/registro').send(user);
            expect(status).to.equal(400);
        } catch (error) {
            createLogger.WARN("Error during duplicate registration test: " + error.message);
            throw error;
        }
    });

    it(
        'POST /api/sessions/login should respond with failure and 401 status code if credentials are incorrect',
        async () => {
            try {
                const data = {
                    email: 'wronguser@test.com',
                    password: '12345678'
                }
                const { status } = await requester.post('/sessions/login').send(data);
                expect(status).to.equal(401);
            } catch (error) {

            }

        }
    )

    it('POST /api/sessions/login should respond with success and 200 status code', async () => {
        try {
            const { headers, status } = await requester.post('/sessions/login').send(user);
            expect(status).to.equal(200);
            expect(headers).to.have.property('set-cookie');
            authCookie = headers['set-cookie'][0].split(';')[0];
        } catch (error) {
            createLogger.WARN("Error during login: " + error.message);
            throw error;
        }
    });

    it(
        'GET /api/sessions/logout should respond with failure and 401 status code if user is not authenticated',
        async () => {
            try {
                const { status } = await requester.get('/sessions/logout');
                expect(status).to.equal(401);
            } catch (error) {
                createLogger.WARN("Error during logout test: " + error.message);
            }
        }
    )
    it('GET /api/sessions/logout should respond with 200 and clear the cookie', async () => {
        try {
    
            if (!authCookie) {
                throw new Error("authCookie no está definida antes del logout. El login falló.");
            }
    
            const response = await requester.get('/sessions/logout').set('Cookie', authCookie);
            expect(response.status).to.equal(200);
    
            expect(response.headers['set-cookie']).to.exist;
        } catch (error) {
            createLogger.WARN("Error during logout: " + error.message);
            throw error;
        }
    });

    after(async () => {
        if (userId) {
            await userService.deleteUser(userId);
            const deletedUser = await userService.getUserBy({ _id: userId });
            expect(deletedUser).to.be.null;
        }
    });
});
