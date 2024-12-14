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
        const { cid } = req.params; // Extraemos el cartId desde la URL
        const { products } = req.body; // Extraemos los productos a modificar desde el cuerpo de la solicitud

        console.log("ID del carrito:", cid);
        console.log("Productos a modificar:", products); // Verificamos los datos que vamos a modificar

        // Llamamos al método para modificar el carrito, pasándole el cartId y los productos modificados
        const cart = await cartManager.updateCart(cid, products);

        // Respondemos con el carrito actualizado
        res.status(200).json({ status: "success", payload: cart });
    } catch (error) {
        console.error("Error al modificar el carrito:", error);
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

// Ruta para agregar un producto a un carrito
router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params; // El cartId y productId vienen de los parámetros de la URL
        const { quantity } = req.body; // La cantidad del producto viene del cuerpo de la solicitud

        // Verificamos que la cantidad sea válida
        if (quantity <= 0) {
            return res.status(400).json({ status: "error", message: "La cantidad debe ser mayor a 0." });
        }

        // Llamamos a addOneProduct para actualizar la cantidad del producto
        const cart = await cartManager.addOneProduct(cid, pid, quantity);

        // Respondemos con el carrito actualizado
        res.status(200).json({ status: "success", payload: cart });
    } catch (error) {
        console.error("Error al modificar el carrito:", error);
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartManager.deleteOneProduct(cid, pid);
        res.status(200).json({ status: "success", payload: cart });
    } catch (error) {
        res.status(error.code).json({ status: "error", message: error.message });
    }
});

// Endpoint para eliminar todos los productos de un carrito
router.delete("/:cid/products", async (req, res) => {
    try {
        const { cid } = req.params; // Obtener el cartId de los parámetros
        const cart = await cartManager.deleteAllProducts(cid); // Llamar al método que elimina todos los productos
        res.status(200).json({ status: "success", payload: cart }); // Responder con el carrito actualizado
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

export default router;