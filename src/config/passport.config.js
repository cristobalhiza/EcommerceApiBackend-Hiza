import passport from "passport";
import local from "passport-local";
import passportJWT from 'passport-jwt'
import GitHubStrategy from 'passport-github2'
import { userService } from "../repository/User.service.js";
import { comparaPassword, generaHash } from "../utils.js";
import { config } from "./config.js";
import { cartService } from "../repository/Cart.service.js";
import { UserManager } from "../dao/userManager.js";

const buscarToken = req => {
    return req.cookies.tokenCookie || null;
};

export const iniciarPassport = () => {
    //paso 1
    passport.use(
        "registro",
        new local.Strategy(
            {
                passReqToCallback: true,
                usernameField: "email",
            },
            async (req, username, password, done) => {
                try {
                    const { first_name:nombre, ...otros } = req.body;
                    if (!nombre || !username || !password) {
                        return done(null, false, { message: "Todos los campos requeridos deben completarse." });
                    }
                    if (password.length < 8) {
                        return done(null, false, { message: "La contraseña debe tener al menos 8 caracteres." });
                    }
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(username)) {
                        return done(null, false, { message: "El email no tiene un formato válido." });
                    }
                    const existe = await userService.getUserBy({username})
                    if (existe) {
                        return done(null, false, { message: `Ya existe un usuario con email ${username}` });
                    }
                    password = generaHash(password);

                    const nuevoUsuario = await UserManager.create({
                        first_name: nombre,
                        email: username,
                        password,
                    });
                    return done(null, nuevoUsuario);

                } catch (error) {
                    console.error('Error durante el registro:', error);
                    return done(error); //segundo argumento de done es el usuario
                }
            }
        )
    );

    passport.use('login',
        new local.Strategy(
            {
                usernameField: 'email'
            },
            async (username, password, done) => {
                try {
                    const usuario = await UserManager.getBy({ email: username })
                    if (!usuario) {
                        return done(null, false)
                    }
                    if (!comparaPassword(password, usuario.password)) {
                        return done(null, false)
                    }
                    delete usuario.password
                    return done(null, usuario)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )
    //paso 1'
    //solo si usamos sessions
    //pasport.serializeUser()
    //pasport.deserializeUser()

    passport.use(new GitHubStrategy({
        clientID: config.GITHUB_CLIENT_ID,
        clientSecret: config.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/api/sessions/github/callback",
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails ? profile.emails[0].value : `${profile.username}@github.com`;
                let user = await UserManager.getBy({ email });

                if (!user) {
                    const randomPassword = Math.random().toString(36).slice(-8);
                    const hashedPassword = generaHash(randomPassword);

                    const nuevoUsuario = {
                        first_name: profile.displayName || profile.username,
                        email: email,
                        password: hashedPassword,
                        role: 'user'
                    };
                    user = await UserManager.create(nuevoUsuario);
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }));
};
passport.use('current',
    new passportJWT.Strategy(
        {
            secretOrKey: config.SECRET,
            jwtFromRequest: new passportJWT.ExtractJwt.fromExtractors([buscarToken]),
        },
        async (usuario, done) => {
            try {
                if (usuario)
                    return done(null, usuario)
                else {
                    return done(null, false)
                }
            } catch (Error) {
                return done(error)
            }
        }

    )
)