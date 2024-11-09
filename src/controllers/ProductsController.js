// src/controllers/ProductsController.js
import { productService } from '../repository/Product.service.js';
import { procesaErrores } from '../utils.js';
import { isValidObjectId } from 'mongoose';

class ProductsController {
    async getProducts(req, res) {
        try {
            const { category, limit = 10, page = 1, sort } = req.query;

            let filter = {};
            if (category) {
                filter.category = { $regex: new RegExp(category, 'i') };
            }

            const options = {
                limit: parseInt(limit),
                page: parseInt(page),
                sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {}
            };

            const result = await productService.getProducts(filter, options);

            res.status(200).json({
                products: result.docs,
                totalPages: result.totalPages,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                limit: parseInt(limit),
            });
        } catch (error) {
            return procesaErrores(res, error);
        }
    }

    async getProductById(req, res) {
        try {
            const { id } = req.params;

            if (!isValidObjectId(id)) {
                return res.status(400).json({ error: 'El ID del producto no es válido' });
            }

            const product = await productService.getProductBy({ _id: id });
            if (!product) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }

            res.status(200).json(product);
        } catch (error) {
            return procesaErrores(res, error);
        }
    }

    async createProduct(req, res) {
        try {
            const { code, title, price, category, stock, status, description, thumbnail } = req.body;

            if (!code || !title || !price || !category || stock == null) {
                return res.status(400).json({ error: 'Faltan campos obligatorios (code, title, price, category, stock)' });
            }

            if (typeof price !== 'number' || price <= 0) {
                return res.status(400).json({ error: 'El precio debe ser un número positivo.' });
            }
            if (typeof stock !== 'number' || stock < 0 || !Number.isInteger(stock)) {
                return res.status(400).json({ error: 'El stock debe ser un número entero no negativo.' });
            }

            const product = await productService.createProduct({ code, title, price, category, stock, status, description, thumbnail });
            res.status(201).json(product);
        } catch (error) {
            return procesaErrores(res, error);
        }
    }

    async updateProduct(req, res) {
        try {
            const { id } = req.params;
            const { code, title, price, category, stock, status, description, thumbnail } = req.body;
    
            if (!isValidObjectId(id)) {
                return res.status(400).json({ error: 'El ID del producto no es válido' });
            }
    
            if (price !== undefined && (typeof price !== 'number' || price <= 0)) {
                return res.status(400).json({ error: 'El precio debe ser un número positivo.' });
            }
            if (stock !== undefined && (typeof stock !== 'number' || stock < 0 || !Number.isInteger(stock))) {
                return res.status(400).json({ error: 'El stock debe ser un número entero no negativo.' });
            }
    
            const updatedProduct = await productService.updateProduct(id, { code, title, price, category, stock, status, description, thumbnail });
            if (!updatedProduct) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
    
            res.status(200).json(updatedProduct);
        } catch (error) {
            return procesaErrores(res, error);
        }
    }

    async deleteProduct(req, res) {
        try {
            const { id } = req.params;

            if (!isValidObjectId(id)) {
                return res.status(400).json({ error: 'El ID del producto no es válido' });
            }

            const success = await productService.deleteProduct(id);
            if (!success) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }

            res.status(200).json({ message: 'Producto eliminado correctamente' });
        } catch (error) {
            return procesaErrores(res, error);
        }
    }
}

export default new ProductsController();