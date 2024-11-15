import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

export class SessionsController {
    static async registro(req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.status(201).json({ message: "Registro exitoso", nuevoUsuario: req.user });
    }

    static async login(req, res) {
        const token = jwt.sign({ id: req.user._id, email: req.user.email }, config.SECRET, { expiresIn: '1h' });
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ message: "Login exitoso", usuario: req.user, token });
    }

    static async current(req, res) {
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