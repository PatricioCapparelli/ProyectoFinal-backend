import { Router } from "express";
import ProductManager from "../../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager();

// Enpoint para obtener todos los productos
router.get("/", async (req, res) => {
    try {
        const products = await productManager.getAll(req.query);
        res.status(200).json({ status: "success", payload: products });
    } catch (error) {
        res.status(error.code).json({ status: "error", message: error.message });
    }
});

// Enpoint para obtener un producto
router.get("/:id", async (req, res) => {
    try {
        const product = await productManager.getOneById(req.params.id);
        res.status(200).json({ status: "success", payload: product });
    } catch (error) {
        res.status(error.code).json({ status: "error", message: error.message });
    }
});

// Enpoint para insertar un producto
router.post("/", async (req, res) => {
    try {
        const product = await productManager.insertOne(req.body);
        res.status(201).json({ status: "success", payload: product });
    } catch (error) {
        res.status(error.code).json({ status: "error", message: error.message });
    }
});

// Enpoint para actualizar un producto
router.put("/:id", async (req, res) => {
    try {
        const product = await productManager.updateOneById(req.params.id, req.body);
        res.status(200).json({ status: "success", payload: product });
    } catch (error) {
        res.status(error.code).json({ status: "error", message: error.message });
    }
});

// Enpoint para eliminar un producto
router.delete("/:id", async (req, res) => {
    try {
        await productManager.deleteOneById(req.params.id);
        res.status(200).json({ status: "success" });
    } catch (error) {
        res.status(error.code).json({ status: "error", message: error.message });
    }
});

export default router;