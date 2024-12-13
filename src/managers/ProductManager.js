import ErrorManager from "./ErrorManager.js";
import { isValidId } from "../config/mongoose.config.js";
import ProductModel from "../models/product.model.js";
import { convertToBoolean } from "../utils/converter.js";

export default class ProductManager {
    #productModel;

    constructor() {
        this.#productModel = ProductModel;
    }

    async #findOneById(id) {
        if (!isValidId(id)) {
            throw new ErrorManager("ID inválido", 400);
        }

        const product = await this.#productModel.findById(id);

        if (!product) {
            throw new ErrorManager("ID no encontrado", 404);
        }

        return product;
    }

    async getOneById(id) {
        try {
            return await this.#findOneById(id);
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    async getAll(params) {
        try {
            const $and = [];

            // Filtro por título (si se pasa)
            if (params?.title) $and.push({ title: { $regex: params.title, $options: "i" } });

            // Filtro por categoría (si se pasa)
            if (params?.category) $and.push({ category: { $regex: params.category, $options: "i" } });

            // Filtro por disponibilidad (si se pasa)
            if (params?.status) $and.push({ status: convertToBoolean(params.status) });

            // Filtro combinado
            const filters = $and.length > 0 ? { $and } : {};

            // Ordenamiento por precio: ascendente o descendente
            const sort = {
                asc: { price: 1 },
                desc: { price: -1 },
            };

            // Opciones de paginación y ordenamiento
            const paginationOptions = {
                limit: params?.limit || 10,
                page: params?.page || 1,
                sort: sort[params?.sort] ?? {}, // Si no hay orden, no aplica ningún sort
                lean: true, // Para obtener resultados más rápidos en formato "lean"
            };

            return await this.#productModel.paginate(filters, paginationOptions);
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    async insertOne(data) {
        try {
            const product = await this.#productModel.create({
                ...data,
                status: convertToBoolean(data.status),
            });

            return product;
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    async updateOneById(id, data) {
        try {
            const product = await this.#findOneById(id);
            const newValues = {
                ...product,
                ...data,
                status: data.status ? convertToBoolean(data.status) : product.status,
            };

            product.set(newValues);
            product.save();

            return product;
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    async deleteOneById(id) {
        try {
            const product = await this.#findOneById(id);
            await product.deleteOne();
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }
}