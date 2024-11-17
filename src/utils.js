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
    console.log(error);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json(
        {
            error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
            // detalle:`${error.message}`
        }
    )
}

export const passportCall = (estrategia) => (req, res, next) => {
    passport.authenticate(estrategia, { session: false }, function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(401).json({ error: info?.message || "No autorizado." });
        }
        req.user = user;
        return next();
    })(req, res, next);
}

export const validateObjectId = (id, componente) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`El ID de ${componente} no es válido.`);
    }
};