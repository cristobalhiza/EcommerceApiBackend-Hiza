import { Router } from 'express';
import passport from 'passport'
import jwt from 'jsonwebtoken'
import { config } from '../config/config.js';
import { passportCall } from '../utils.js';

export const router = Router();

router.get('/error', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    return res.status(401).json({ error: `Error al autenticar` })
})

router.post(
    '/registro',
    // passport.authenticate('registro', {session: false, failureRedirect: 'api/sessions/error'}),
    passportCall('registro'),
    (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        return res.status(201).json({ payload: `Registro exitoso para ${req.user.first_name},`, nuevoUsuario: req.user });
    }
)

router.post(
    '/login',
    passport.authenticate('login', { session: false, failureRedirect: 'api/sessions/error' }),
    (req, res) => {
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
        res.cookie('tokenCookie', token, { httpOnly: true })
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ payload: `Login exitoso para ${req.user.first_name}`, usuarioLogeado: req.user });
    }
)

router.get('/current', passportCall('current'), (req, res) => {

    if (!req.user) {
        return res.status(401).json({ error: 'No se pudo autenticar el usuario.' });
    }

    res.status(200).json({
        id: req.user._id,
        first_name: req.user.first_name,
        email: req.user.email,
        role: req.user.role
    });
});

router.get('/logout', (req, res) => {

    res.clearCookie('tokenCookie');
    
    const { web } = req.query;
    if (web) {
        return res.redirect(`/login?mensaje=¡Logout exitoso!`);
    }
    
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ mensaje: '¡Logout exitoso!' });
});

