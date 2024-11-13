import { Router } from "express";
import ProductManager from "../managers/productManager.js";

const router = Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
    try {
        const products = await productManager.getAll();
        return res.status(200).render("products", { title: "Datos De Los Productos", products });
    } catch (error) {
        console.error("Error en la ruta:", error); // Log de error
        res.status(error.code || 500).send(`<h1>Error</h1><h3>${error.message}</h3>`);
    }
});

router.get("/register", async (req, res) => {
    try {
        return res.status(200).render("register", { title: "Registrar Usuario" });
    } catch (error) {
        console.error("Error en la ruta:", error); // Log de error
        res.status(error.code || 500).send(`<h1>Error</h1><h3>${error.message}</h3>`);
    }
});

router.get("/:id", async (req, res) => {
    try {
        const product = await productManager.getOneById(req.params.id);
        return res.status(200).render("product", { title: "Datos Del Producto", product });
    } catch (error) {
        console.error("Error en la ruta:", error); // Log de error
        res.status(error.code || 500).send(`<h1>Error</h1><h3>${error.message}</h3>`);
    }
});

export default router;