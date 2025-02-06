import mongoose from "mongoose"
import loggerUtil from "./utils/logger.util.js"

export const connDB = async (url = "", db = "") => {
    try {
        await mongoose.connect(
            url,
            {
                dbName: db
            })
        loggerUtil.INFO(`Conexión a DB establecida`)
    } catch (err) {
        loggerUtil.WARN(`Error al conectarse con el servidor de BD: ${err.message}`)
    }
}