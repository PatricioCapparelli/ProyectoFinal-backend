import { connect, Types } from "mongoose";

export const connectDB = async () => {
    const URL = "mongodb+srv://pato:1234@cluster0.bfyvn.mongodb.net/proyectoFinal";
    try {
        await connect(URL);
        console.log("Conectado a MongoDB");

    } catch (error) {
        console.log("error al conectar con MongoDB", error.message);

    }
};

export const isValidId = (id) => {
    console.log("Verificando ID:", id);
    return Types.ObjectId.isValid(id);
};