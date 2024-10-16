import { Router } from 'express';
import passport from 'passport'
import jwt from 'jsonwebtoken'
import { config } from '../config/config.js';
export const router = Router()

router.get('/error', (req, res)=>{
    res.setHeader('Content-Type','application/json');
    return res.status(401).json({error:`Error al autenticar`})
})

router.post(
    '/registro',
    passport.authenticate('registro', {session: false, failureRedirect: 'api/sessions/error'}),
    (req, res)=>{
        res.setHeader('Content-Type','application/json');
        return res.status(201).json({payload:`Registro exitoso para ${req.user.first_name},`, usuario: req.user});
    }
)

router.post(
    '/login',
    passport.authenticate('login', {session: false, failureRedirect: 'api/sessions/error'}),
    (req, res)=>{
const token = jwt.sign(
            { id: req.user._id, email: req.user.email, role: req.user.role },
            config.SECRET,
            { expiresIn: '1h' } 
        );
        res.setHeader('Content-Type','application/json');
        return res.status(200).json({payload:`Login exitoso para ${req.user.first_name}`, usuarioLogeado:req.user, token: token});
    }
)

// router.get('/logout', (req, res) => {

//     const { web } = req.query

//     req.session.destroy(error => {
//         if (error) {
//             res.setHeader('Content-Type', 'application/json');
//             return res.status(500).json({ error: `Error al realizar logout` })
//         }
//         if (web) {
//             return res.redirect(`/login?mensaje=¡Logout exitoso!`)
//         }
//         res.setHeader('Content-Type', 'application/json');
//         return res.status(200).json({ mensaje: '¡Logout exitoso!' })
//     })
// })

