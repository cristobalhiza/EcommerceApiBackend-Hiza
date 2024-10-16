import { usersModel } from "./models/usuarios.model.js";
import { generaHash } from "../utils.js";


export class UsuariosManager{

    static async create(usuario={}){
        let nuevoUsuario=await usersModel.create(usuario);
        return nuevoUsuario.toJSON();
    }
    static async getBy(filtro={}){
        return await usersModel.findOne(filtro).lean()
    }
    static async crearAdminInicial() {
        try {
            const adminExistente = await usersModel.findOne({ email: 'adminCoder@coder.com' }).lean();
            if (!adminExistente) {
                const admin = {
                    first_name: 'admin',
                    email: 'adminCoder@coder.com',
                    password: await generaHash('adminCod3r123'),
                    role: 'admin'
                };
                await usersModel.create(admin);
                console.log('Usuario rol admin creado con éxito.');
            } else {
                console.log('El usuario rol admin ya existe.');
            }
        } catch (error) {
            console.error('Error al crear el usuario rol admin:', error);
        }
    }
}