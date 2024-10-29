import express from 'express';
import path from 'path';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import { engine } from 'express-handlebars';

import { __dirname } from './utils.js';
import { UserManager } from './dao/userManager.js';
import { router as vistasRouter } from './routes/viewsRouter.js';
import { router as sessionsRouter } from './routes/sessionsRouter.js';
import { connDB } from './connDB.js';
import { config } from './config/config.js';
import { checkAuth } from './middleware/checkAuth.js';
import { iniciarPassport } from './config/passport.config.js';

export class Server {
    constructor() {
        this.app = express();
        this.PORT = config.PORT;
        this.middlewares();
        this.templateEngine();
        this.routes();
        this.handleErrors();
        this.connectDatabase();
        UserManager.crearAdminInicial();
    }

    middlewares() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.app.use(express.static('./src/public'));
        iniciarPassport();
        this.app.use(passport.initialize());
        this.app.use(checkAuth);
        this.app.use(express.static(path.join(__dirname, '/public')));
    }

    templateEngine() {
        this.app.engine('handlebars', engine({
            runtimeOptions: {
                allowProtoPropertiesByDefault: true,
                allowProtoMethodsByDefault: true,
            },
        }));
        this.app.set('view engine', 'handlebars');
        this.app.set('views', path.join(__dirname, '/views'));
    }

    routes() {
        this.app.use('/api/sessions', sessionsRouter);
        this.app.use('/', vistasRouter);
    }

    handleErrors() {
        this.app.use((req, res, next) => {
            res.status(404).json({ error: `Cannot ${req.method} ${req.originalUrl}` });
        });
        this.app.use((err, req, res, next) => {
            res.status(500).json({ error: 'Error del servidor.' });
        });
    }

    connectDatabase() {
        connDB(config.MONGO_URL, config.DB_NAME);
    }

    start() {
        this.app.listen(this.PORT, () => {
            console.log(`Server escuchando en puerto ${this.PORT}`);
        });
    }
}
