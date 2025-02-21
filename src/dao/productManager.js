import Product from './models/product.model.js'

export default class ProductManager {

    static async get(filter = {}, options = {}) {
        try {
            return await Product.paginate(filter, { 
                lean: true, 
                collation: { locale: 'en', strength: 2 },
                select: '-__v -createdAt -updatedAt',
                ...options 
            },);
        } catch (error) {
            throw new Error('Error obteniendo productos: ' + error.message);
        }
    }

    static async getBy(filter) {
        try {
            return await Product.findOne(filter).lean(); 
        } catch (error) {
            throw new Error('Error obteniendo producto: ' + error.message);
        }
    }

    static async create(product) {
        try {
            return await Product.create(product);
        } catch (error) {
            throw new Error('Error creating product ' + error.message);
        }
    }

    static async update(productId, data) {
        try {
            return await Product.findByIdAndUpdate(productId, data, { new: true }).lean();
        } catch (error) {
            throw new Error('Error actualizando producto: ' + error.message);
        }
    }

    static async delete(id) {
        try {
            return await Product.findByIdAndDelete(id).lean();
        } catch (error) {
            throw new Error('Error eliminando producto: ' + error.message);
        }
    }
}