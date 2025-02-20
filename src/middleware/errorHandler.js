import loggerUtil from '../utils/logger.util.js';

const errorHandler = (error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || "FATAL ERROR";

    if (statusCode === 400) {
        loggerUtil.log({ level: 'WARN', message: `400 - Solicitud incorrecta: ${message}` });
    } else if (statusCode === 401) {
        loggerUtil.log({ level: 'WARN', message: `401 - No autorizado: ${message}` });
    } else if (statusCode === 403) {
        loggerUtil.log({ level: 'WARN', message: `403 - Acceso prohibido: ${message}` });
    } else {
        loggerUtil.log({ level: 'FATAL', message: `500 - Error del servidor: ${message}` });
    }

    res.status(statusCode).json({
        error: message, 
        ...(process.env.NODE_ENV !== 'production' && { detalle: error.stack })
    });
};

export default errorHandler;
