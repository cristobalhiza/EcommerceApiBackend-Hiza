import { Router } from 'express';
import { passportCall } from '../utils.js';
import { auth } from '../middleware/auth.js';


export const router = Router();

router.get('/', (req, res) => {
    const isLogin = !!req.headers.authorization;
    res.status(200).render('home', { isLogin });
});

router.get('/registro', (req, res) => {
    const isLogin = !!req.headers.authorization;
    res.status(200).render('registro', { isLogin });
});

router.get('/login', (req, res) => {
    const isLogin = !!req.headers.authorization;
    res.status(200).render('login', { isLogin });
});

router.get('/current', passportCall('current'), auth('user'), (req, res) => {
    res.status(200).render('current', {
        isLogin: true, 
        user: req.user 
    });
});
