import jwt from "jsonwebtoken"
import { config } from "../config/config.js"

export const auth = (req, res, next) => {
    let { web } = req.query
    if (!req.cookies.tokenCookie) {
        if (web) {
            return res.redirect('/login?mensaje=No hay usuario autenticados')
        } else {
            res.setHeader('Content-Type', 'application/json');
            return res.status(401).json({ error: `No hay usuarios autenticados` })
        }
    }
    console.log(req.headers.authorization)
    const token = req.cookies.tokenCookie
    try {
        req.user = jwt.verify(token, config.SECRET)
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(401).json({ error: `${error.message}` })
    }
    next()
}