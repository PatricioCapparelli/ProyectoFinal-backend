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

    async insertOne(data) {
        try {
            const product = await this.#productModel.create({
                ...data,
                available: convertToBoolean(data.available),
                status: convertToBoolean(data.status),
            });

            await product.save();
            return product.toObject();
        } catch (error) {
            throw ErrorManager.handleError(error);
        }}

    async updateOneById(id, data) {
        try {
            const product = await this.#findOneById(id);
            const newValues = {
                ...product,
                ...data,
                status: data.status ? convertToBoolean(data.status) : product.status,
                available: data.available ? convertToBoolean(data.available) : product.available,
            };

            product.set(newValues);
            await product.save();

            return product.toObject();
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