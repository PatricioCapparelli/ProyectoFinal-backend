import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";
import CartManager from "../managers/CartManager.js";

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

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
    try {
        const product = await productManager.getOneById(productId);
        console.log("Producto encontrado: ", product);
        if (product) {
            res.render("productDetails", { product });
        } else {
            res.status(404).send("Producto no encontrado");
        }
    } catch (error) {
        console.error("Error al recuperar el producto:", error);
        res.status(500).send("Error al recuperar el producto");
    }
});

// Ruta para obtener los productos del carrito
router.get("/api/carts/view/:id", async (req, res) => {
    const cartId = req.params.id;
    try {
        const cart = await cartManager.getOneById(cartId);
        console.log("Carrito obtenido:", cart);

        // Datos del carrito a renderizar
        const cartData = {
            _id: cart._id.toString(),
            products: cart.products,
        };

        // Enviar los datos del carrito como JSON
        res.render("cart", { cartData });
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(500).json({ message: "Error al obtener el carrito" });
    }
});

export default router;