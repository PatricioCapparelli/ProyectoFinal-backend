import { Router } from "express";
import moment from "moment";
import CartManager from "../managers/CartManager.js";

const router = Router();
const cartManager = new CartManager();

// Ruta para obtener un carrito por su ID y mostrarlo en una vista
router.get("/:id", async (req, res) => {
    try {
        const data = await cartManager.getOneById(req.params.id);

        const plainData = data.toObject();

        // Formatea las fechas de creación y actualización del carrito
        data.createdAt = moment(data.createdAt).format("YYYY-MM-DD HH:mm:ss");
        data.updatedAt = moment(data.updatedAt).format("YYYY-MM-DD HH:mm:ss");

        res.status(200).render("cart", { title: "Carrito", data: plainData });
    } catch (error) {
        res.status(500).json({ status: false });
    }
});

export default router;