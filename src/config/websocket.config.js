import { Server } from "socket.io";
import paths from "../utils/paths.js";
import ProductManager from "../managers/ProductManager.js";
import { generateNameForFile } from "../utils/random.js";
import { writeFile } from "../utils/fileSystem.js";

const productManager = new ProductManager();

let serverSocket = null;

// Configura el servidor Socket
export const config = (serverHTTP) => {
    // Crea una nueva instancia de Server con el servidor HTTP proporcionado
    serverSocket = new Server(
        serverHTTP,
        {
            maxHttpBufferSize: 5e6, // Permitir archivos hasta 5MB (por defecto es 1MB)
        },
    );

    // Escucha el evento de conexión de un nuevo socket
    serverSocket.on("connection", async (socket) => {
        const response = await productManager.getAll({ limit: 100 });
        console.log("Socket connected");

        // Envía la lista de productos al cliente que se conecta
        serverSocket.emit("products-list", response);

        // Escucha el evento para insertar un nuevo producto
        socket.on("insert-product", async (data) => {
            if (data?.file) {
                const filename = generateNameForFile(data.file.name);
                await writeFile(paths.images, filename, data.file.buffer);

                await productManager.insertOne(data, filename);
                const response = await productManager.getAll({ limit: 100 });

                // Envía la lista de productos actualizada después de insertar
                serverSocket.emit("products-list", response);
            }
        });

        // Escucha el evento para eliminar un producto
        socket.on("delete-product", async (data) => {
            await productManager.deleteOneById(data.id);
            const response = await productManager.getAll({ limit: 100 });

            // Envía la lista de productos actualizada después de eliminar
            serverSocket.emit("products-list", response);
        });
    });
};

// Función para actualizar la lista de productos
export const updateProductsList = async () => {
    const response = await productManager.getAll({ limit: 100 });

    // Envía la lista de productos actualizada
    serverSocket.emit("products-list", { response });
};