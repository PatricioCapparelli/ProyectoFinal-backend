import { Server } from "socket.io";
import ProductManager from "../managers/ProductManager.js";
import CartManager from "../managers/CartManager.js";

const productManager = new ProductManager();
const cartManager = new CartManager();

export const config = (httpServer) => {

    const socketServer = new Server(httpServer);

    socketServer.on("connection", async (socket) => {
        console.log("Conexión establecida", socket.id);

        socketServer.emit("products-list", { products: await productManager.getAll() });

        socket.on("insert-product", async (data) => {
            try {
                await productManager.insertOne(data);
                socketServer.emit("products-list", { products: await productManager.getAll() });

            } catch (error) {
                socketServer.emit("error-message", { message: error.message });

            }
        });

        // Servidor - manejo del evento 'view-product-details'
        socket.on("view-product-details", async (data) => {
            console.log("Recibiendo solicitud de detalles para el producto con ID:", data.id);

            // Obtener el producto del servidor
            const product = await productManager.getOneById(data.id);

            if (product) {
                console.log("Producto encontrado:", product);

                socket.emit("product-details", product);
                console.log("Detalles del producto emitidos al cliente.");
            } else {
                console.log("Producto no encontrado.");
                socket.emit("error-message", { message: "Producto no encontrado" });
            }
        });

        socket.on("delete-product", async (data) => {
            try {
                await productManager.deleteOneById(Number(data.id));
                socketServer.emit("products-list", { products: await productManager.getAll() });

            } catch (error) {
                socketServer.emit("error-message", { message: error.message });

            }
        });

        socket.on('add-to-cart', async ({ cartId, productId }) => {
            try {
                // Verificar que los IDs no sean nulos
                if (!cartId || !productId) {
                    throw new Error('Cart ID o Product ID no válidos');
                }
    
                // Aquí llama a tu método de agregar producto al carrito (que probablemente esté en tu CartManager)
                const updatedCart = await cartManager.addOneProduct(cartId, productId);
    
                // Emitir la respuesta al cliente
                socket.emit('product-added-to-cart', {
                    status: 'success',
                    cart: updatedCart
                });
            } catch (error) {
                console.error('Error al agregar al carrito:', error);
                socket.emit('product-added-to-cart', {
                    status: 'error',
                    message: error.message || 'Hubo un problema al agregar el producto al carrito'
                });
            }
        });

        socket.on("disconnect", () => {
            console.log("Se desconecto un cliente");
        });
    });
};