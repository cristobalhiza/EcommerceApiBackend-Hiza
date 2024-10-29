import { Router } from 'express';
import { passportCall } from '../utils.js';
import { auth } from '../middleware/auth.js';


export const router = Router();
//login
router.get('/', (req, res) => {
    res.status(200).render('home');
});

router.get('/registro', (req, res) => {
    res.status(200).render('registro');
});

router.get('/login', (req, res) => {
    res.status(200).render('login');
});

router.get('/current', passportCall('current'), auth('user'), (req, res) => {
    res.status(200).render('current', {
        user: req.user
    });
});
//cart
router.get('/:cid', async (req, res) => {
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
});

//products
router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        const result = await ProductManager.get(page, limit);

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
        return procesaErrores(res, error)
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        if (!isValidObjectId(pid)) {
            return res.status(400).json({ error: "El ID del producto no es válido" });
        }

        const product = await ProductManager.getBy({ _id: pid });
        if (product) {
            res.status(200).render('productDetails', { product });
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        return procesaErrores(res, error)
    }
});

export default router;
