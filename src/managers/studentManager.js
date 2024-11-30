
import StudentModel from "../models/student.model.js";
import ErrorManager from "./errorManager.js";
import { isValidId } from "../config/mongoose.config.js";

export default class StudentManager {
    #student;

    constructor() {
        this.#student = StudentModel;
    }

    async getAll(params) {
        try {
            const $and = [];

            if(params?.firstName) $and.push({ firstName: params.firstName.toString().toUpperCase() });
            if(params?.lastName) $and.push({ lastName: params.lastName.toString().toUpperCase() });
            if(params?.age) $and.push({ age: Number(params.age) });
            if(params?.ageGte) $and.push({ age: { $gte: Number(params.ageGte) } });
            if(params?.ageLte) $and.push({ age: { $lte: Number(params.ageLte) } });

            const filters = $and.length > 0 ? { $and } : {};

            return await this.#student.find(filters);
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    // Busca un student por su ID

    async #findOneById(id) {

        if (!isValidId(id)) {
            throw new ErrorManager("ID invalido", 400);
        }

        const studentFound = await this.#student.findById({ _id: id });

        if(!studentFound){
            throw new ErrorManager("Id no encontrado", 404);
        }

        return studentFound;
    }

    // Obtiene un student especifico por su ID

    async getOneById(id) {
        try {
            const studentFound = await this.#findOneById(id);
            return studentFound;
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    // Agrega un student

    async insertOne(data) {
        try {
            const student = await this.#student.create(data);
            return student;

        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    // Actualiza un student en especifico

    async updateOneById(id, data) {
        try {
            const studentFound = await this.#findOneById(id);
            const newValues = { ...studentFound, ...data };
            studentFound.set(newValues);
            studentFound.save();

            return studentFound;
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    // Elimina un student en especifico

    async deleteOneById(id) {
        try {
            const studentFound = await this.#findOneById(id);
            return studentFound.deleteOne();

        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

}