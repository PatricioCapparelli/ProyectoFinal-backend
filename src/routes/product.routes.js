import { Router } from "express";
import moment from "moment";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager();

// Ruta para obtener un producto por su ID y mostrarlo en una vista
router.get("/:id/cart/:rid", async (req, res) => {
    try {
        const { id, rid: cartId } = req.params;
        const data = await productManager.getOneById(id);
        data.createdAt = moment(data.createdAt).format("YYYY-MM-DD HH:mm:ss");
        data.updatedAt = moment(data.updatedAt).format("YYYY-MM-DD HH:mm:ss");
        data.currentCartId = cartId;

        res.status(200).render("productDetails", { title: "Producto", data });
    } catch (error) {
        res.status(500).json({ status: false });
    }
});

export default router;