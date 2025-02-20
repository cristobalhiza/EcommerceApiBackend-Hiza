// src/controllers/ProductsController.js
import { productService } from '../services/Product.service.js';
import { isValidObjectId } from 'mongoose';
import createError from 'http-errors';

class ProductsController {
    async getProducts(req, res, next) {
        try {
            const { category, limit = 10, page = 1, sort, sortBy = 'price' } = req.query;

            const parsedLimit = parseInt(limit, 10);
            const parsedPage = parseInt(page, 10);
            if (isNaN(parsedLimit) || parsedLimit <= 0) {
                return next(createError(400, "El límite debe ser un número mayor a 0."));
            }
            if (isNaN(parsedPage) || parsedPage <= 0) {
                return next(createError(400, "La página debe ser un número mayor a 0."));
            }

            const filter = category ? { category: { $regex: new RegExp(category, 'i') } } : {};

            const options = {
                limit: parsedLimit,
                page: parsedPage,
                sort: sort ? { [sortBy]: sort === 'asc' ? 1 : -1 } : {},
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
                limit: parsedLimit,
            });
        } catch (error) {
            next(error);
        }
    }

    async getProductById(req, res, next) {
        try {
            const { id } = req.params;
    
            if (!isValidObjectId(id)) {
                return next(createError(400, 'El ID del producto no es válido'));
            }
    
            const product = await productService.getProductBy({ _id: id });
            if (!product) {
                return next(createError(404, 'Producto no encontrado'));
            }
    
            res.status(200).json(product);
        } catch (error) {
            next(error);
        }
    }

    async createProduct(req, res, next) {
        try {
            const { code, title, price, category, stock, status, description, thumbnail } = req.body;
    
            if (!code || !title || !price || !category || stock == null) {
                return next(createError(400, 'Faltan campos obligatorios (code, title, price, category, stock)'));
            }
    
            if (typeof price !== 'number' || price <= 0) {
                return next(createError(400, 'El precio debe ser un número positivo.'));
            }
            if (typeof stock !== 'number' || stock < 0 || !Number.isInteger(stock)) {
                return next(createError(400, 'El stock debe ser un número entero no negativo.'));
            }
    
            const result = await productService.createProduct({ code, title, price, category, stock, status, description, thumbnail });
    
            if (result.error) {
                return next(createError(400, result.message));
            }
    
            res.status(201).json(result);
        } catch (error) {
            next(error);
                }
    }

    async updateProduct(req, res, next) {
        try {
            const { id } = req.params;
            const { code, title, price, category, stock, status, description, thumbnail } = req.body;
    
            if (!isValidObjectId(id)) {
                return next(createError(400, 'El ID del producto no es válido'));
            }
    
            if (price !== undefined && (typeof price !== 'number' || price <= 0)) {
                return next(createError(400, 'El precio debe ser un número positivo.'));
            }
            if (stock !== undefined && (typeof stock !== 'number' || stock < 0 || !Number.isInteger(stock))) {
                return next(createError(400, 'El stock debe ser un número entero no negativo.'));
            }
    
            const updatedProduct = await productService.updateProduct(id, { code, title, price, category, stock, status, description, thumbnail });
            if (!updatedProduct) {
                return next(createError(404, 'Producto no encontrado'));
            }
    
            res.status(200).json(updatedProduct);
        } catch (error) {
            next(error);
                }
    }

    async deleteProduct(req, res, next) {
        try {
            const { id } = req.params;

            if (!isValidObjectId(id)) {
                return next(createError(400, 'El ID del producto no es válido'));
            }
            const deletedProduct = await productService.deleteProduct(id);
            if (!deletedProduct) {
                return next(createError(404, 'Producto no encontrado'));
            }
            res.status(200).json({ message: `Producto "${deletedProduct.title}" eliminado correctamente` });
        } catch (error) {
            next(error);
                }
    }

    // async createMockProduct(req, res, next) {
    //     try {
    //         const one = await productService.createMockProduct()
    
    //         res.status(201).json({message: "Created!", response: one});
    //     } catch (error) {
    //         next(error);
    //     }
    // }

    // async createMockProducts(req, res, next) {
    //     try {
    //         const { quantity } = req.params;
    //         const products = await productService.createMockProducts(quantity);
    //         return res.status(201).json({ message: `${quantity} Products Created! `, response: products });
    //     } catch (error) {
    //         next(error)
    //     }
    // }
}

export default new ProductsController();