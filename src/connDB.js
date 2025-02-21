import mongoose from "mongoose"
import createLogger from "./utils/logger.util.js"

export const connDB = async (url = "", db = "") => {
    try {
        await mongoose.connect(
            url,
            {
                dbName: db
            })
        createLogger.INFO(`Conexión a DB establecida`)
    } catch (err) {
        createLogger.WARN(`Error al conectarse con el servidor de BD: ${err.message}`)
    }
}