import passport from "passport";
import local from "passport-local";
import passportJWT from 'passport-jwt'
import GitHubStrategy from 'passport-github2'
import { UsuariosManager } from "../dao/usuariosManager.js";
import { comparaPassword, generaHash } from "../utils.js";
import { config } from "./config.js";

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
                console.log('iniciando registro')
                try {
                    const { first_name } = req.body;
                    if (!first_name) {
                        return done(null, false, { message: 'Complete el campo nombre' });
                    }
                    const existe = await UsuariosManager.getBy({ email: username });
                    if (existe) {
                        return done(null, false, { message: `Ya existe un usuario con email ${username}` });
                    }
                    password = generaHash(password);
                    console.log('Creando nuevo usuario');

                    const nuevoUsuario = await UsuariosManager.create({
                        first_name,
                        email: username,
                        password,
                    });
                    console.log('Usuario creado con éxito');
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
                    const usuario = await UsuariosManager.getBy({ email: username })
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
                let user = await UsuariosManager.getBy({ email });

                if (!user) {
                    const randomPassword = Math.random().toString(36).slice(-8);
                    const hashedPassword = generaHash(randomPassword);

                    const nuevoUsuario = {
                        first_name: profile.displayName || profile.username,
                        email: email,
                        password: hashedPassword,
                        role: 'user'
                    };
                    user = await UsuariosManager.create(nuevoUsuario);
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