import passport from "passport";
import local from "passport-local";
import { UsuariosManager } from "../dao/usuariosManager.js";
import { comparaPassword, generaHash } from "../utils.js";

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
                        console.log('Falta el campo first_name');
                        return done(null, false);
                    }
                    const existe = await UsuariosManager.getBy({ email: username });
                    if (existe) {
                        console.log('El usuario ya existe');
                        return done(null, false);
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
                    if(!comparaPassword(password, usuario.password)){
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
};
