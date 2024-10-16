import { Router } from 'express';
import { auth } from '../middleware/auth.js';

export const router = Router()

router.get('/', (req, res) => {

    res.status(200).render('home', {})
})

router.get('/registro', (req, res) => {

    res.status(200).render('registro', {})
})

router.get('/login', (req, res) => {

    res.status(200).render('login', {})
})

router.get('/current', auth, (req, res) => {
    (200).render('current', {});
})