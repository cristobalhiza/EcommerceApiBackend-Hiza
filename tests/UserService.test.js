// tests/UserService.test.js

import { userService } from '../src/services/User.service.js';
import { UserManager } from '../src/dao/userManager.js';
import { generaHash, comparaPassword } from '../src/utils.js';

jest.mock('../src/utils.js', () => ({
    generaHash: jest.fn().mockResolvedValue("hashedPassword123"),
    comparaPassword: jest.fn()
}));

// Configuración explícita de los métodos de UserManager como mocks
UserManager.getBy = jest.fn();
UserManager.create = jest.fn();
UserManager.update = jest.fn();
UserManager.crearAdminInicial = jest.fn();

describe("UserService - Validaciones y Casos Límite", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("createUser lanza error si el email ya está en uso", async () => {
        UserManager.getBy.mockResolvedValue({ email: "usuario@example.com" });

        const userData = {
            first_name: "Juan",
            email: "usuario@example.com",
            password: "password123",
            role: "user"
        };

        await expect(userService.createUser(userData))
            .rejects
            .toThrow("El email ya está en uso. Use un email diferente.");
    });

    test("createUser crea el usuario correctamente cuando los datos son válidos", async () => {
        UserManager.getBy.mockResolvedValue(null); // Email no existe
        UserManager.create.mockResolvedValue({
            first_name: "Juan",
            email: "usuario@example.com",
            password: "hashedPassword123",
            role: "user"
        });

        const userData = {
            first_name: "Juan",
            email: "usuario@example.com",
            password: "password123",
            role: "user"
        };

        const result = await userService.createUser(userData);

        expect(result).toEqual({
            first_name: "Juan",
            email: "usuario@example.com",
            password: "hashedPassword123",
            role: "user"
        });
        expect(UserManager.create).toHaveBeenCalledWith({
            ...userData,
            password: "hashedPassword123"
        });
    });

    test("initializeAdminUser crea el usuario admin si no existe", async () => {
        UserManager.crearAdminInicial.mockResolvedValue(true);

        const result = await userService.initializeAdminUser();

        expect(result).toBe(true);
        expect(UserManager.crearAdminInicial).toHaveBeenCalled();
    });

    test("initializeAdminUser no crea el usuario admin si ya existe", async () => {
        UserManager.crearAdminInicial.mockResolvedValue(false);

        const result = await userService.initializeAdminUser();

        expect(result).toBe(false);
        expect(UserManager.crearAdminInicial).toHaveBeenCalled();
    });
});

describe("UserService - Actualización de Contraseña", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("updatePassword lanza error si la contraseña actual es incorrecta", async () => {
        const userId = "12345";
        UserManager.getBy.mockResolvedValue({
            _id: userId,
            password: "hashedOldPassword"
        });
        comparaPassword.mockResolvedValue(false); // Contraseña incorrecta

        await expect(userService.updatePassword(userId, "wrongPassword", "newPassword123"))
            .rejects
            .toThrow("La contraseña actual no es correcta.");
    });

    test("updatePassword lanza error si la nueva contraseña es demasiado corta", async () => {
        const userId = "12345";
        UserManager.getBy.mockResolvedValue({
            _id: userId,
            password: "hashedOldPassword"
        });
        comparaPassword.mockResolvedValue(true); // Contraseña correcta

        await expect(userService.updatePassword(userId, "correctPassword", "short"))
            .rejects
            .toThrow("La nueva contraseña debe tener al menos 8 caracteres.");
    });

    test("updatePassword actualiza la contraseña correctamente", async () => {
        const userId = "12345";
        UserManager.getBy.mockResolvedValue({
            _id: userId,
            password: "hashedOldPassword"
        });
        comparaPassword.mockResolvedValue(true); // Contraseña correcta
        generaHash.mockResolvedValue("hashedNewPassword");

        // Mock para update
        UserManager.update.mockResolvedValue({
            _id: userId,
            password: "hashedNewPassword"
        });

        const result = await userService.updatePassword(userId, "correctPassword", "newPassword123");

        expect(result).toEqual({
            _id: userId,
            password: "hashedNewPassword"
        });
        expect(UserManager.update).toHaveBeenCalledWith(userId, { password: "hashedNewPassword" });
    });
});
