import { __dirname } from './utils.js';
import path from 'path';
import express from 'express';
import { engine } from 'express-handlebars';
import passport from 'passport'
import cookieParser from 'cookie-parser';

import { UsuariosManager } from './dao/usuariosManager.js';
import { router as vistasRouter } from './routes/viewsRouter.js'
import { router as sessionsRouter } from './routes/sessionsRouter.js'
import { connDB } from './connDB.js';
import { config } from './config/config.js';
import { checkAuth } from './middleware/checkAuth.js';
import { iniciarPassport } from './config/passport.config.js';

const PORT = config.PORT;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//estos dos últimos middlewares sirven para procesar información compleja que llegue desde la request, desde el cliente
app.use(cookieParser())
app.use(express.static('./src/public'))

app.engine('handlebars', engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));
iniciarPassport()
app.use(passport.initialize())
app.use(checkAuth);
app.use(express.static(path.join(__dirname, '/public')));
app.use('/api/sessions', sessionsRouter)
app.use('/', vistasRouter)
app.use((req, res, next) => {
    res.status(404).json({ error: `Cannot ${req.method} ${req.originalUrl}` });
});
app.use((err, req, res, next) => {
    res.status(500).json({ error: 'Error del servidor.' });
});
UsuariosManager.crearAdminInicial();

const server = app.listen(PORT, () => {
    console.log(`Server escuchando en puerto ${PORT}`);
});

connDB(config.MONGO_URL, config.DB_NAME)

