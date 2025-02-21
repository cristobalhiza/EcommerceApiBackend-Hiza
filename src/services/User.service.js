// src/services/User.service.js
import { UserManager } from "../dao/userManager.js";
import { comparaPassword, generaHash } from "../utils/utils.js";
import { createMockUser } from "../utils/mocks.utils.js"
import loggerUtil from "../utils/logger.util.js";

class UserService {
    constructor(DAO) {
        this.userDAO = DAO;
    }

    async createUser(userData) {
        return await this.userDAO.create(userData);
    }
    
    async updatePassword(userId, oldPassword, newPassword) {
        const user = await this.userDAO.getBy({ _id: userId });
        if (!user) {
            throw new Error("Usuario no encontrado.");
        }

        const isMatch = await comparaPassword(oldPassword, user.password);
        if (!isMatch) {
            throw new Error("La contraseña actual no es correcta.");
        }

        const hashedNewPassword = await generaHash(newPassword);
        return await this.userDAO.update(userId, { password: hashedNewPassword });
    }

    async getUserBy(filter = {}) {
        return await this.userDAO.getBy(filter);
    }

    async initializeAdmin() {
        const adminCreated = await this.userDAO.crearAdminInicial();
        if (adminCreated) {
            loggerUtil.INFO("Usuario rol admin creado con éxito.");
        } else {
            loggerUtil.INFO("El usuario rol admin ya existe.");
        }
        return adminCreated;
    }
    async updateUser(userId, data) {
        return await this.userDAO.update(userId, data);
    }
    
    async deleteUser(userId) {
        return await this.userDAO.delete(userId);
    }

    async createMockUser() {
        try {
            const userData = createMockUser();
            return await this.userDAO.create(userData);
        } catch (error) {
            throw new Error('Error creando Mock User: ' + error.message);
        }
    }

    async createMockUsers(quantity) {
        try {
            const users = Array.from({ length: quantity }, createMockUser);
            return users;
        } catch (error) {
            throw new Error('Error creando Mock Users: ' + error.message);
        }
    }
}

export const userService = new UserService(UserManager);