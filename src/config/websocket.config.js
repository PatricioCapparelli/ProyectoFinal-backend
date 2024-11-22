import { Server } from "socket.io";
import ProductManager from "../managers/productManager.js";

const productManager = new ProductManager();

export const config = (httpServer) => {
    const socketServer = new Server(httpServer);

    socketServer.on("connection", async (socket) => {
        socketServer.emit("products-list", { products: await productManager.getAll() });

        socket.on("insert-product", async (data) => {
            try {
                console.log("hola", data);
                await productManager.insertOne(data);

                socketServer.emit("products-list", { products: await productManager.getAll() });
            } catch (error) {
                socketServer.emit("error-message", { message: error.message });
            }
        });

        socket.on("delete-product", async (data) => {
            try {
                await productManager.deleteOneById(data.id);

                socketServer.emit("products-list", { products: await productManager.getAll() });
            } catch (error) {
                socketServer.emit("error-message", { message: error.message });
            }
        });
    });
};
