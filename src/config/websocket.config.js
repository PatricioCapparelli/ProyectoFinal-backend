import { Server } from "socket.io";

export const messages = [];

export const config = (httpServer) => {
    const socketServer = new Server(httpServer);

    socketServer.on("connection", (socket) => {
        const clientId = socket.id;
        console.log("Conexion establecida:", clientId);

        // socket.on("greet", (data) => {
        //     console.log(data);

        //     socketServer.emit("greeting", { text: "Que onda" });
        // });

        socket.on("newText", (data) => {
            messages.push({ socketId: socket.id, message: data.text });
            socketServer.emit("message", { messages });
        });

        socket.on("clearMessages", () => {
            messages.length = "";
            socketServer.emit("message", { messages });
        });

        socket.on("disconnect", () => {
            console.log("Se desconecto el cliente:", clientId);
        });
    });
};