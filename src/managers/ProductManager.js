import ErrorManager from "./ErrorManager.js";
import { isValidId } from "../config/mongoose.config.js";
import ProductModel from "../models/product.model.js";
import { convertToBoolean } from "../utils/converter.js";
import { deleteFile } from "../utils/fileSystem.js";
import paths from "../utils/paths.js";

export default class ProductManager {
    #productModel;

    constructor() {
        this.#productModel = ProductModel;
    }

    async #findOneById(id) {
        if (!isValidId(id)) {
            throw new ErrorManager("ID inválido", 400);
        }
        const product = await this.#productModel.findOne({ _id: id });
        if (!product) {
            throw new ErrorManager("ID no encontrado", 404);
        }

        return product;
    }

    async getOneById(id) {
        try {
            const productFound = await this.#findOneById(id);
            return productFound.toObject();
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    async getAll(params) {
        try {
            const $and = [];

            if (params?.title) $and.push({ title: { $regex: params.title, $options: "i" } });
            if (params?.category) $and.push({ category: { $regex: params.category, $options: "i" } });
            if (params?.status) $and.push({ status: convertToBoolean(params.status) });
            if (params?.available) $and.push({ available: convertToBoolean(params.available) });
            const filters = $and.length > 0 ? { $and } : {};

            const sort = {
                asc: { price: 1 },
                desc: { price: -1 },
            };

            const paginationOptions = {
                limit: params?.limit || 10,
                page: params?.page || 1,
                sort: sort[params?.sort] ?? {},
                lean: true,
            };

            return await this.#productModel.paginate(filters, paginationOptions);
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    insertOne = async (data, filename) => {
        try {
            const product = await this.#productModel.create({
                ...data,
                status: convertToBoolean(data.status),
                availability: convertToBoolean(data.availability),
                thumbnail: filename ?? null,
            });

            await product.save();
            return product.toObject();
        } catch (error) {
            if (filename) await deleteFile(paths.images, filename);
            throw ErrorManager.handleError(error);}
    };

    // Actualiza un producto por su ID
    updateOneById = async (id, data, filename) => {
        try {
            const productFound = await this.#findOneById(id);
            const currentThumbnail = productFound.thumbnail;
            const newThumbnail = filename;

            const newValues = {
                ...data,
                status: convertToBoolean(data.status),
                availability: convertToBoolean(data.availability),
                thumbnail: newThumbnail ?? currentThumbnail,
            };

            productFound.set(newValues);
            await productFound.save();

            if (filename && newThumbnail !== currentThumbnail) {
                await deleteFile(paths.images, currentThumbnail);
            }

            return productFound.toObject();
        } catch (error) {
            if (filename) await deleteFile(paths.images, filename);
            throw ErrorManager.handleError(error);}
    };

    // Elimina un producto por su ID
    deleteOneById = async (id) => {
        try {
            const productFound = await this.#findOneById(id);

            if (productFound.thumbnail) {
                await deleteFile(paths.images, productFound.thumbnail);
            }

            await this.#productModel.deleteOne({ _id: productFound._id });
            return productFound.toObject();
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    };
}