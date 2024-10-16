import jwt from "jsonwebtoken"
import { config } from "../config/config.js"

export const auth=(req, res, next)=>{
    let {web}=req.query
    if(!req.headers.authorization || !localStorage.token){
        if(web){
            return res.redirect('/login?mensaje=No hay usuario autenticados')
        }else{
        res.setHeader('Content-Type','application/json');
        return res.status(401).json({error:`No hay usuarios autenticados`})
        }
    }
    const token=req.headers.authorization.split(' ')[1]
    try {
        req.user=jwt.verify(token, config.SECRET)
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(401).json({error:`${error.message}`})
    }
    return next()
}