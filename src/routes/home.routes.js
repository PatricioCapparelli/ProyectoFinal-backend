import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager();
const currentCartId = "677405a9acdb365a2aecd799"; // ID del carrito, de la BD

// Ruta para obtener todos los productos con opciones de consulta y mostrar la vista principal
router.get("/", async (req, res) => {
    try {
        const data = await productManager.getAll(req.query);

        // Si se pasa un parámetro de ordenamiento, agrega a los datos para su uso en la vista
        data.sort = req.query?.sort ? `&sort=${req.query.sort}` : "";

        // Asigna el ID del carrito actual a los datos de respuesta
        data.currentCartId = currentCartId;

        // Añade el ID del carrito actual a cada producto en la lista de productos
        data.docs = data.docs.map((doc) => {
            return { ...doc, currentCartId };
        });

        res.status(200).render("home", { title: "Inicio", data });
    } catch (error) {
        res.status(500).json({ status: false });
    }
});

// Ruta para renderizar la vista de productos en tiempo real
router.get("/real-time-products", async (req, res) => {
    try {
        res.status(200).render("realTimeProducts", { title: "Tiempo Real" });
    } catch (error) {
        res.status(500).json({ status: false });
    }
});

export default router;