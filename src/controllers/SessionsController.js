import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import { cartService } from '../services/Cart.service.js';

export class SessionsController {
    static async registro(req, res) {
        try {
            const newUser = req.user;

            if (newUser.role === 'user' && req.cookies.cartId) {
                await cartService.linkCartToUser(req.cookies.cartId, newUser._id);
                res.clearCookie('cartId');
            }

            res.setHeader('Content-Type', 'application/json');
            return res.status(201).json({ payload: `Registro exitoso para ${newUser.first_name}`, nuevoUsuario: newUser });
        } catch (error) {
            return res.status(500).json({ error: 'Error en el servidor al registrar el usuario' });
        }
    }

    static async login(req, res) {
        const token = jwt.sign(
            {
                id: req.user._id,
                email: req.user.email,
                role: req.user.role,
                first_name: req.user.first_name
            },
            config.SECRET,
            { expiresIn: '1h' }
        );

        if (req.user.role === 'user' && req.cookies.cartId) {
            await cartService.linkCartToUser(req.cookies.cartId, req.user._id);
            res.clearCookie('cartId');
        }

        res.cookie('tokenCookie', token, { httpOnly: true });
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ payload: `Login exitoso para ${req.user.first_name}`, usuarioLogeado: req.user });
    }
    
    static async current(req, res) {
        if (!req.user) {
            return res.status(401).json({ error: 'No se pudo autenticar el usuario.' });
        }

        res.status(200).json({
            id: req.user._id,
            first_name: req.user.first_name,
            email: req.user.email,
            role: req.user.role
        });
    }

    static async logout(req, res) {
        res.clearCookie('tokenCookie');

        const { web } = req.query;
        if (web) {
            return res.redirect(`/login?mensaje=¡Logout exitoso!`);
        }

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ mensaje: '¡Logout exitoso!' });
    }

    static async githubCallback(req, res) {
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
    }

    static async error(req, res) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(401).json({ error: 'Error al autenticar' });
    }
}