// src/controllers/ViewsController.js
import { isValidObjectId } from 'mongoose';
import { CartManager } from '../dao/cartManager.js';
import ProductManager from '../dao/productManager.js';
import { procesaErrores } from '../utils.js';

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
    

    async renderCart(req, res) {
        try {
            const { cid } = req.params;

            if (!isValidObjectId(cid)) {
                return res.status(400).render('cart', { error: 'El ID del carrito no es válido.' });
            }

            const cart = await CartManager.getCart(cid);
            if (!cart) {
                return res.status(404).render('cart', { error: 'Carrito no encontrado' });
            }

            res.render('cart', { cart });
        } catch (error) {
            return procesaErrores(res, error);
        }
    }

    async renderProducts(req, res) {
        try {
            const { limit = 10, page = 1, sort, query } = req.query;

            const result = await ProductService.getProducts(page, limit);
            res.status(200).render('index', {
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

    async renderProductDetails(req, res) {
        try {
            const { pid } = req.params;
            if (!isValidObjectId(pid)) {
                return res.status(400).render('productDetails', { error: 'El ID del producto no es válido' });
            }

            const product = await ProductManager.getBy({ _id: pid });
            if (product) {
                res.status(200).render('productDetails', { product });
            } else {
                res.status(404).render('productDetails', { error: 'Producto no encontrado' });
            }
        } catch (error) {
            return procesaErrores(res, error);
        }
    }
}

export default new ViewsController();