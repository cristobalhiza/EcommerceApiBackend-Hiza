import { createLogger, format, transports, addColors } from "winston";

const { colorize, simple } = format

const levels = {
    FATAL: 0,
    WARN: 1,
    INFO: 2,
    HTTP: 3
}

const colors = {
    FATAL: 'red',
    WARN: 'yellow',
    INFO: 'blue',
    HTTP: 'white'
}

addColors(colors)

export default createLogger({
    levels,
    format: colorize(),
    transports: [
        new transports.Console({ level: "HTTP", format: simple() }),
        new transports.File({ 
            filename: "./src/utils/errors/error.log", 
            level: "FATAL", 
            format: simple() 
        }),
    ]
})