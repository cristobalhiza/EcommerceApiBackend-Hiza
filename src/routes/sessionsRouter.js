import { Router } from 'express';
import { UsuariosManagerMongo as UsuariosManager } from '../dao/usuariosManagerMONGO.js';
import { generaHash, comparaPassword, procesaErrores } from '../utils.js';
export const router = Router()

router.post('/registro', async (req, res) => {
    const { nombre, email, password } = req.body
    if (!nombre || !email || !password) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({ error: 'Complete los datos' })
    }
    //validaciones
    try {
        const existe = await UsuariosManager.getBy({ email })
        if (existe) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Ya existe un usuario con email ${email}` })
        }

        const hashedPassword = await generaHash(password);

        const nuevoUsuario = await UsuariosManager.create({ nombre, email, password: hashedPassword });

        res.setHeader('Content-Type', 'application/json')
        res.status(201).json({ mensaje: 'Registro exitoso', nuevoUsuario })

    } catch (error) {
        procesaErrores(res, error)
    }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Complete datos` })
    }

    try {
        const usuario = await UsuariosManager.getBy({ email })
        if (!usuario) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(401).json({ error: `Credenciales inválidas` })
        }
        const esValido = await comparaPassword(password, usuario.password);
        if (!esValido) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(401).json({ error: `Credenciales inválidas` });
        }
        delete usuario.password;

        req.session.usuario = usuario

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ mensaje: 'Login existoso', usuarioLogeado: usuario });
    } catch (error) {
        procesaErrores(res, error)
    }
})

router.get('/logout', (req, res) => {

    const { web } = req.query

    req.session.destroy(error => {
        if (error) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ error: `Error al realizar logout` })
        }
        if (web) {
            return res.redirect(`/login?mensaje=¡Logout exitoso!`)
        }
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ mensaje: '¡Logout exitoso!' })
    })
})