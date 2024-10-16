import { Router } from 'express';
import { auth } from '../middleware/auth.js';

export const router = Router()

router.get('/', (req, res) => {

    res.status(200).render('home', {isLogin:req.session.usuario})
})

router.get('/registro', (req, res) => {

    res.status(200).render('registro', {isLogin:req.session.usuario})
})

router.get('/login', (req, res) => {

    res.status(200).render('login', {isLogin:req.session.usuario})
})

router.get('/current', auth, (req, res) => {
    if (!req.session.usuario) {
        return res.redirect('/login');
    }
    res.status(200).render('current', { isLogin: req.session.usuario });
})