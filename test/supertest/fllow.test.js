import { expect } from "chai";
import { config } from "../../src/config/config.js";
import { connDB } from "../../src/connDB.js";
import supertest from "supertest";
import createLogger from "../../src/utils/logger.util.js";

const requester = supertest(`http://localhost:${config.PORT}/api`);

describe('Testing admin login, CRUD, logout', () => {
    before(async () => {
        await connDB(config.MONGO_URL, config.DB_NAME);
    });

    const admin = {
        email: ''
    }
    it('POST /api/sessions/login should respond with 200 status code', async () => { })
    it('POST /api/products/ should respond with 201 status code', async () => { })
    it('GET /api/products/:pid should respond with 200 status code', async () => { })
    it('PUT /api/products/:pid should respond with 200 status code', async () => { })
    it('DELETE /api/products/:pid should respond with 200 status code', async () => { })
    it('POST /api/sessions/logout should respond with 200 status code', async () => { })


}
)