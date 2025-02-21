import createLogger from "../utils/logger.util.js";

function httpLogger(req, res, next) {
    const message = `${req.method} ${req.url} - ${new Date().toLocaleTimeString()}`;
    if (req.path === '/favicon.ico') {
        return res.status(204).end();
    }
    req.logger = createLogger;
    req.logger.HTTP(message);
    next();
}

export default httpLogger;