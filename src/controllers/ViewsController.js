// src/controllers/ViewsController.js
import { isValidObjectId } from 'mongoose';
import { CartManager } from '../dao/cartManager.js';
import ProductManager from '../dao/productManager.js';
import { productService } from '../services/Product.service.js';

class ViewsController {
    renderHome(req, res) {
        res.status(200).render('home', {
            isLogin: !!req.cookies.tokenCookie
        });
    }

    renderRegistro(req, res) {
        res.status(200).render('registro');
    }

    renderLogin(req, res) {
        res.status(200).render('login');
    }

    renderCurrent(req, res) {
        res.status(200).render('current', {
            user: req.user,
            isLogin: !!req.user
        });
    }


    async renderCart(req, res, next) {
        try {
            const { cid } = req.params;

            if (!isValidObjectId(cid)) {
                return next(createError(400, 'El ID del carrito no es válido'))
            }

            const cart = await CartManager.getCart(cid);
            if (!cart) {
                return next(createError(404, 'Carrito no encontrado'));
            }

            res.render('cart', { cart });
        } catch (error) {
            next(error);
        }
    }

    async renderProducts(req, res, next) {
        try {
            const { limit = 10, page = 1, sort, query } = req.query;

            const filter = query ? { name: { $regex: query, $options: "i" } } : {};
            const options = {
                limit: parseInt(limit, 10),
                page: parseInt(page, 10),
                sort: sort ? { price: sort === "asc" ? 1 : -1 } : {},
            };

            const result = await productService.getProducts(filter, options);
            if (!result || result.docs.length === 0) {
                return next(createError(404, "No se encontraron productos"));
            }
            res.status(200).render("index", { products: result.docs });
        } catch (error) {
            console.error("Error en renderProducts:", error);
            next(error);
        }
    }


    async renderProductDetails(req, res, next) {
        try {
            const { pid } = req.params;
            if (!isValidObjectId(pid)) {
                return next(createError(400, 'El ID del producto no es válido'));
            }

            const product = await ProductManager.getBy({ _id: pid });
            if (!product) {
                return next(createError(404, 'Producto no encontrado'));
            }

            res.status(200).render('productDetails', { product });
        } catch (error) {
            next(error);
        }
    }
}

export default new ViewsController();