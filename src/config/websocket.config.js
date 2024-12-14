import { Server } from "socket.io";
import ProductManager from "../managers/ProductManager.js";

const productManager = new ProductManager();

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
            console.log("Recibido ID del producto:", data.id); // Verifica el ID del producto recibido

            try {
                const product = await productManager.getOneById(data.id); // Obtén el producto por ID
                if (product) {
                    console.log("Producto encontrado:", product);
                    socket.emit("product-details", product );
                    console.log( product, "enviado");
                } else {
                    socket.emit("error-message", { message: "Producto no encontrado" });
                }
            } catch (error) {
                console.error("Error al recuperar el producto:", error);
                socket.emit("error-message", { message: error.message });
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

        socket.on("disconnect", () => {
            console.log("Se desconecto un cliente");
        });
    });
};