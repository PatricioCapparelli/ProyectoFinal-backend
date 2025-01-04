import { Router } from "express";
import CartManager from "../../managers/CartManager.js";

const router = Router();
const cartManager = new CartManager();

// Endpoint para obtener los carritos
router.get("/", async (req, res) => {
    try {
        const carts = await cartManager.getAll(req.query);
        res.status(200).json({ status: "success", payload: carts });
    } catch (error) {
        res.status(error.code).json({ status: "error", message: error.message });
    }
});

// Endpoint para obtener un carrito por su ID
router.get("/:id", async (req, res) => {
    console.log("ID recibido desde la URL:", req.params.id); // Verificar el ID recibido desde la URL
    try {
        const cart = await cartManager.getOneById(req.params.id);
        res.status(200).json({ status: "success", payload: cart });
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(error.code).json({ status: "error", message: error.message });
    }
});

// Endpoint para crear un carrito
router.post("/", async (req, res) => {
    try {
        const cart = await cartManager.insertOne(req.body);
        res.status(201).json({ status: "success", payload: cart });
    } catch (error) {
        res.status(error.code).json({ status: "error", message: error.message });
    }
});

// Endpoint para incrementar en una unidad o agregar un producto especifico en un carrito por su ID
router.post("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;

    try {

        const updatedCart = await cartManager.addOneProduct(cid, pid);
        return res.status(200).json(updatedCart);
    } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
        return res.status(500).json({ status: "error", message: "Error al modificar el carrito" });
    }
});

// Enpoint para modificar productos del carrito
router.put("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;

        const cart = await cartManager.updateOneById(cid, products);

        res.status(200).json({ status: "success", payload: cart });
    } catch (error) {
        console.error("Error al modificar el carrito:", error);
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

// Ruta para actualizar un carrito existente por su ID
router.put("/:id", async (req, res) => {
    try {
        const cart = await cartManager.updateOneById(req.params.id, req.body);
        res.status(200).json({ status: true, payload: cart });
    } catch (error) {
        handleError(res, error.message);
    }
});

// Endpoint para agregar un producto a un carrito
router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const cart = await cartManager.addOneProduct(cid, pid, quantity ?? 1);
        res.status(200).json({ status: true, payload: cart });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const cart = await cartManager.deleteOneById(req.params.id);
        res.status(200).json({ status: true, payload: cart });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

// Ruta para decrementar en una unidad o eliminar un producto específico en un carrito por su ID
router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartManager.deleteOneProduct(cid, pid, 1);
        res.status(200).json({ status: true, payload: cart });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

// Enpoint para eliminar todos los productos de un carrito
router.delete("/:cid/products", async (req, res) => {
    try {
        const cart = await cartManager.deleteAllProducts(req.params.cid);
        res.status(200).json({ status: true, payload: cart });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

export default router;