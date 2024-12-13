import { Router } from "express";
import CartManager from "../managers/CartManager.js";

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

// Endpoint para incrementar en una unidad o agregar un producto específico en un carrito por su ID
router.post("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        console.log("Carrito ID:", cid, "Producto ID:", pid); // Verificar los parámetros
        const cart = await cartManager.addOneProduct(cid, pid);
        res.status(200).json({ status: "success", payload: cart });
    } catch (error) {
        console.error(error); // Verificar el error en caso de fallo
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

router.put("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.addOneProduct(cid);
        res.status(200).json({ status: "success", payload: cart });
    } catch (error) {
        res.status(error.code).json({ status: "error", message: error.message });
    }
});

router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        await cartManager.deleteOneProduct(cid, pid);
        res.status(200).json({ status: "success" });
    } catch (error) {
        res.status(error.code).json({ status: "error", message: error.message });
    }
});

export default router;