import { Router } from 'express';
import { isValidObjectId } from 'mongoose';
import { CartsManager } from '../dao/cartsManager.js';
import Product from '../dao/models/productsModel.js';
import Cart from '../dao/models/cartsModel.js';
import { procesaErrores } from '../utils.js';

const router = Router();

//crea carro vacío
router.post('/', async (req, res) => {
    try {
        const newCart = await CartsManager.create();
        res.status(201).json({ message: 'Carrito creado', cart: newCart });
    } catch (error) {
        return procesaErrores(res, error)
    }
});

//crea carrito al agregar producto, quise mantener esta ruta que tenía porque en la práctica
//me parece más lógico que se cree un carrito al agregar un producto, no sé qué sentido tiene un carrito vacío
router.post('/create/product/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const { quantity } = req.body;

        if (!isValidObjectId(pid)) {
            return res.status(400).json({ error: 'El ID del producto no es válido' });
        }

        const parsedQuantity = parseInt(quantity) || 1; //por defecto 1 si no se envía

        if ( parsedQuantity <= 0) {
            return res.status(400).json({ error: 'La cantidad debe ser un número positivo' });
        }

        const product = await Product.findById(pid);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const cart = await Cart.create({ products: [{ product: pid, quantity: parsedQuantity }] });

        res.status(201).json({ cart });
    } catch (error) {
        return procesaErrores(res, error)
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
            return res.status(400).json({ error: 'El ID del carrito o del producto no es válido' });
        }

        const parsedQuantity = parseInt(quantity) || 1; //por defecto 1 si no se envía
        if (parsedQuantity <= 0) {
            return res.status(400).json({ error: 'La cantidad debe ser un número positivo' });
        }

        const updatedCart = await CartsManager.addProductToCart(cid, pid, parsedQuantity);

        res.status(200).json({ message: 'Producto agregado al carrito', cart: updatedCart });
    } catch (error) {
        return procesaErrores(res, error)
    }
});

router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body; //array de productos

        if (!isValidObjectId(cid)) {
            return res.status(400).json({ error: 'El ID del carrito no es válido' });
        }

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: 'Debes enviar un arreglo de productos' });
        }

        const updatedCart = await CartsManager.update(cid, { products });

        res.status(200).json({ message: 'Carrito actualizado', cart: updatedCart });
    } catch (error) {
        return procesaErrores(res, error)
    }
});

router.put('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
            return res.status(400).json({ error: 'El ID del carrito o producto no es válido' });
        }

        const parsedQuantity = parseInt(quantity);
        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
            return res.status(400).json({ error: 'La cantidad debe ser un número positivo' });
        }

        const updatedCart = await CartsManager.updateProductQuantity(cid, pid, parsedQuantity);

        res.status(200).json({ message: 'Cantidad actualizada', cart: updatedCart });
    } catch (error) {
        return procesaErrores(res, error)
    }
});

router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;

        if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
            return res.status(400).json({ error: 'El ID del carrito o producto no es válido' });
        }

        const updatedCart = await CartsManager.deleteProductFromCart(cid, pid);

        res.status(200).json({ message: 'Producto eliminado del carrito', cart: updatedCart });
    } catch (error) {
        return procesaErrores(res, error);
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;

        if (!isValidObjectId(cid)) {
            return res.status(400).json({ error: 'El ID del carrito no es válido' });
        }

        const clearedCart = await CartsManager.clearCart(cid);

        res.status(200).json({ message: 'Carrito vaciado correctamente', cart: clearedCart });
    } catch (error) {
        res.status(500).json({ error: 'No se pudo vaciar el carrito', message: error.message });
    }
});

router.get('/', async(req, res)=>{
    try {
        const carts = await CartsManager.getAllCarts();
        res.status(200).json(carts);    
    } catch(error) {
        return procesaErrores(res, error);
    }
})

router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        if (!isValidObjectId(cid)) {
            return res.status(400).json({ error: 'El ID del carrito no es válido' })
        }
        const cart = await CartsManager.getCart(cid);
        res.status(200).json({ cart })
    } catch (error) {
        return procesaErrores(res, error)
    }
})

export default router;
