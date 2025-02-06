import loggerUtil from '../utils/logger.util.js';

const errorHandler = (error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || "FATAL ERROR";

    if (statusCode >= 400 && statusCode < 500) {
        loggerUtil.log({ level: 'WARN', message });
    } else {
        loggerUtil.log({ level: 'FATAL', message });
    }

    res.status(statusCode).json({
        error: message, 
        ...(process.env.NODE_ENV !== 'production' && { detalle: error.stack })
    });
};

export default errorHandler;
