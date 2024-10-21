import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

export const checkAuth = (req, res, next) => {
    const token = req.cookies.tokenCookie;
    if (token) {
        try {
            const decoded = jwt.verify(token, config.SECRET);
            req.user = decoded; 
            res.locals.isLogin = true; 
        } catch (error) {
            res.locals.isLogin = false;
        }
    } else {
        res.locals.isLogin = false;
    }
    next();
};
