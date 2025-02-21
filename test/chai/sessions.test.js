import { expect } from 'chai';
import { userService } from '../../src/services/User.service.js';
import { config } from '../../src/config/config.js';
import { connDB } from '../../src/connDB.js';

describe(
    'Sessions Testing',
    () => {
        before(async () => {
            await connDB(config.MONGO_URL, config.DB_NAME);
        });
        it('should return a user object with and _id property', async () => {
            const data = {
                email: 'testchai@test.com',
                password: '12345678'
            }
            const user = await userService.createUser(data);
            expect(user).to.have.property('_id');
            await userService.deleteUser(user._id);
        });
        it('should throw and error if required fields are missings', async () => {
            try {
                await userService.createUser({});
                expect.fail('An error should be thrown for missing fields');
            } catch (error) {
                expect(error.message).to.equal('Todos los campos requeridos deben completarse.')
            }
        });
    }
)