import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt'
import passport from 'passport';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

export const generaHash = password => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
};

export const comparaPassword = (password, hash) => {
    return bcrypt.compareSync(password, hash);
};

export const procesaErrores = (res, error) => {
    console.error('Error en el servidor:', error);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({
        error: 'Error inesperado en el servidor. Por favor, intente más tarde.',
        ...(process.env.NODE_ENV !== 'production' && { detalle: error.message })
    });
};

export const passportCall = (estrategia) => (req, res, next) => {
    passport.authenticate(estrategia, { session: false }, function (err, user, info) {
        if (err) {
            console.error('Error en Passport:', err);
            return res.status(500).json({ error: 'Error inesperado en autenticación.' });        }
        if (!user) {
            return res.status(401).json({
                error: info?.message || 'Usuario no autorizado. Verifica tus credenciales.',
            });
        }

        req.user = user;
        next();
    })(req, res, next);
};

export const validateObjectId = (id, componente) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`El ID de ${componente} no es válido.`);
    }
};