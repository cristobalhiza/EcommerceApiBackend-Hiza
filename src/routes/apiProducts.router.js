import { Router } from 'express';
import Product from '../dao/models/product.model.js';
import { procesaErrores } from '../utils.js';

export const router = Router()

router.get('/', async (req, res) => {
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

        const result = await Product.paginate(filter, options);

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
});

router.get('/:id', async (req, res) => {
    try {
        const { code, title, price, category, stock } = req.body;

        if (!code || !title || !price || !category || stock == null) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

        const productExists = await Product.findOne({ code });
        if (productExists) {
            return res.status(400).json({ error: 'El código del producto ya existe' });
        }

        const newProduct = new Product({ code, title, price, category, stock });
        const savedProduct = await newProduct.save();

        res.status(201).json(savedProduct);
    } catch (error) {
        return procesaErrores(res, error)
    }
});


router.post('/', async (req, res) => {
    try {
        const { code, title, price, category, stock, status, description, thumbnail } = req.body;

        if (!code || !title || !price || !category || stock == null) {
            return res.status(400).json({ error: 'Faltan campos obligatorios (code, title, price, category, stock)' });
        }

        const productExists = await Product.findOne({ code });
        if (productExists) {
            return res.status(400).json({ error: 'El código del producto ya existe' });
        }

        const newProduct = new Product({ code, title, price, category, stock, status, description, thumbnail });
        const savedProduct = await newProduct.save();

        res.status(201).json(savedProduct);
    } catch (error) {
        return procesaErrores(res, error);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { code, title, price, category, stock, status, description, thumbnail } = req.body;

        if (!code || !title || !price || !category || stock == null) {
            return res.status(400).json({ error: 'Faltan campos obligatorios (code, title, price, category, stock)' });
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, { code, title, price, category, stock, status, description, thumbnail }, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        return procesaErrores(res, error);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.status(200).json({ message: 'Producto eliminado correctamente', deletedProduct });
    } catch (error) {
        return procesaErrores(res, error);
    }
});

export default router;
