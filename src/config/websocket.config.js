import { Server } from "socket.io";
import StudentManager from "../managers/studentManager.js";

const studentManager = new StudentManager();

export const config = (httpServer) => {
    const socketServer = new Server(httpServer);

    socketServer.on("connection", async (socket) => {
        socketServer.emit("students-list", { students: await studentManager.getAll() });

        socket.on("insert-student", async (data) => {
            try {
                await studentManager.insertOne(data);

                socketServer.emit("students-list", { students: await studentManager.getAll() });
            } catch (error) {
                socketServer.emit("error-message", { message: error.message });
            }
        });

        socket.on("delete-student", async (data) => {
            try {
                await studentManager.deleteOneById(data.id);

                socketServer.emit("students-list", { students: await studentManager.getAll() });
            } catch (error) {
                socketServer.emit("error-message", { message: error.message });
            }
        });
    });
};