import Product from './models/productsModel.js';

export default class ProductsManager {

    static async get(page = 1, limit = 10) {
        try {
            return await Product.paginate({}, { lean: true, page, limit });
        } catch (error) {
            throw new Error('Error obteniendo productos: ' + error.message);
        }
    }

    static async getBy(filtro = {}) {
        return await Product.findOne(filtro).lean();
    }

    static async create(product) {
        const { code, title, description, price, category, stock, status, thumbnail } = product;
    
        console.log({ code, title, description, price, category, stock, status, thumbnail });
    
        if (!code || !title || !price || !category || stock == null) {
            throw new Error('Todos los campos requeridos deben completarse.');
        }
    
        try {
            return await Product.create(product);
        } catch (error) {
            if (error.code === 11000 && error.keyPattern && error.keyPattern.code) {
                throw new Error('El código del producto ya existe, elija uno único.');
            }
            throw new Error('Error creando producto: ' + error.message);
        }
    }

    static async update(id, product) {
        return await Product.findByIdAndUpdate(id, product, { new: true }).lean();
    }

    static async delete(id) {
        return await Product.findByIdAndDelete(id);
    }
}
