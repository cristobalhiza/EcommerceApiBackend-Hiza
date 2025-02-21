import { fileURLToPath } from 'url';
import path from 'path';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import createLogger from './logger.util.js';

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.resolve(path.dirname(__filename), "..");

export const generaHash = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
};

export const comparaPassword = (password, hash) => {
    return bcrypt.compareSync(password, hash);
};

export const errorHandler = (res, error) => {
    createLogger.FATAL('Error en el servidor:', error);
    const statusCode = error.statusCode || 500;
    const message = error.message || 'FATAL ERROR';
    if (statusCode.toString().startsWith('4')) {
        createLogger.WARN(error);
    } else {
        createLogger.FATAL(error);
    }
    return res.status(statusCode).json({
        error: 'Error inesperado en el servidor. Por favor, intente más tarde.',
        ...(process.env.NODE_ENV !== 'production' && { detalle: message }),
    });
};
export const passportCall = (estrategia) => (req, res, next) => {
    passport.authenticate(estrategia, { session: false }, function (err, user, info) {
        if (err) {
            console.error('Error en Passport:', err);
            return res.status(500).json({ error: 'Error inesperado en autenticación.' });
        }

        if (!user) {
            const statusCode = info?.status || 400;
            return res.status(statusCode).json({
                error: info?.message || 'Usuario no autorizado. Verifica tus credenciales.',
            });
        }


        req.user = user;
        next();
    })(req, res, next);
};