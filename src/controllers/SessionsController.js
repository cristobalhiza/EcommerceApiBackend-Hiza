import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import UsersDTO from '../DTO/UsersDTO.js';

export class SessionsController {
    static async registro(req, res, next) {
        try {
            if (!req.user) {
                return next(createError(400, `No se pudo registrar el usuario: ${JSON.stringify(req.body)}`));
            }
            res.setHeader('Content-Type', 'application/json');
            res.status(201).json({ message: "Registro exitoso", nuevoUsuario: req.user });
        } catch (error) {
            next(error);
        }
    }

    static async login(req, res, next) {
        try {
            if (!req.user) {
                return next(createError(401, "Credenciales inválidas"));
            }
            const token = jwt.sign(
                {
                    id: req.user._id,
                    email: req.user.email,
                    first_name: req.user.first_name,
                    role: req.user.role,
                    cart: req.user.cart
                },
                config.SECRET,
                { expiresIn: '1h' }
            );

            const userDTO = new UsersDTO(req.user);

            res.cookie('tokenCookie', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
                maxAge: 3600000 * 4
            });

            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({ message: "Login exitoso", usuario: userDTO, token });
        } catch (error) {
            next(error);
        }
    }

    static async current(req, res, next) {
        try {
            if (!req.user) {
                return next(createError(401, "Usuario no autenticado. Inicia sesión para continuar."));
            }

            const response = {
                id: req.user.id,
                email: req.user.email,
                first_name: req.user.first_name,
                role: req.user.role,
            };

            if (req.user.cart) {
                response.cart = req.user.cart;
            }

            res.status(200).json({
                message: "Información del usuario obtenida exitosamente",
                usuario: response,
            });
        } catch (error) {
            next(error);
        }
    }

    static async logout(req, res, next) {
        try {
            const token = req.cookies?.tokenCookie;
            
            if (!token) {
                return res.status(401).json({ error: "No hay ningún usuario autenticado." });
            }
    
            res.clearCookie('tokenCookie');
    
            const { web } = req.query;
            if (web) {
                return res.redirect(`/login?mensaje=¡Logout exitoso!`);
            }
    
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ mensaje: '¡Logout exitoso!' });
        } catch (error) {
            next(error);
        }
    }

    static async githubCallback(req, res, next) {
        try {
            const token = jwt.sign(
                {
                    _id: req.user._id,
                    email: req.user.email,
                    role: req.user.role,
                    first_name: req.user.first_name
                },
                config.SECRET,
                { expiresIn: '1h' }
            );
            res.cookie('tokenCookie', token, { httpOnly: true });
            res.redirect('/current');
        } catch (error) {
            next(error);
        }
    }

    static async error(req, res, next) {
        try {
            return next(createError(401, "Error al autenticar"));
        } catch (error) {
            next(error);
        }
    }
}