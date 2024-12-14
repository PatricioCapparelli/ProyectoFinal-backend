import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
    try {
        res.render("home", { title: "Home" });
    } catch (error) {
        res.status(500).send(`<h1>Error</h1><h3>${error.message}</h3>`);
    }
});

router.get("/realTimeProducts", async (req, res) => {
    try {
        res.render("realTimeProducts", { title: "Products" });
    } catch (error) {
        res.status(500).send(`<h1>Error</h1><h3>${error.message}</h3>`);
    }
});

router.get("/api/products/view/:id", async (req, res) => {
    const productId = req.params.id;
    const product = await productManager.getOneById(productId);

    if (product) {
        res.render("productInfo", { product });
    } else {
        res.status(404).send("Producto no encontrado");
    }
});

export default router;