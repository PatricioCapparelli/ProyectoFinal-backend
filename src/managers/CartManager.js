import { mongoose, Types } from "mongoose";

import ErrorManager from "./ErrorManager.js";
import CartModel from "../models/cart.model.js";
import ProductModel from "../models/product.model.js";

export default class CartManager {
    #cartModel;

    constructor() {
        this.#cartModel = CartModel;
    }

    async #findOneById(id) {

        id = id.trim();

        if (!/^[a-fA-F0-9]{24}$/.test(id)) {
            console.log("ID no valido por formato:", id);
            throw new ErrorManager("ID invalido", 400);
        }

        if (!Types.ObjectId.isValid(id)) {
            console.log("ID no válido segun Mongoose:", id);
            throw new ErrorManager("ID invalido", 400);
        }

        const objectId = new Types.ObjectId(id);
        console.log("ID convertido a ObjectId:", objectId);

        const cart = await this.#cartModel.findById(objectId).populate("products.product");
        if (!cart) {
            console.log("Carrito no encontrado para el ID:", id);
            throw new ErrorManager("ID no encontrado", 404);
        }

        return cart;
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
            const paginationOptions = {
                limit: params?.limit || 10,
                page: params?.page || 1,
                populate: "products.product",
                lean: true,
            };

            return await this.#cartModel.paginate({}, paginationOptions);
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    async insertOne(data) {
        try {
            const cart = await this.#cartModel.create(data);
            return cart;
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    isValidId(id) {
        return mongoose.Types.ObjectId.isValid(id);
    }

    async addOneProduct(cartId, productId) {
        try {
            // Elimina los saltos de línea u otros caracteres adicionales del ID
            const cleanProductId = productId.trim();// Esto eliminará saltos de línea, espacios, etc.

            // Verifica que el cartId y el productId sean ObjectIds válidos
            if (!this.isValidId(cartId) || !this.isValidId(cleanProductId)) {
                throw new ErrorManager("ID inválido", 400);
            }

            const cart = await this.#cartModel.findById(cartId);
            const product = await ProductModel.findById(cleanProductId);

            if (!product) {
                throw new ErrorManager("Producto no encontrado", 404);
            }

            const productIndex = cart.products.findIndex(
                (item) => item.product.toString() === cleanProductId,
            );

            if (productIndex >= 0) {
                cart.products[productIndex].quantity++;
            } else {
                cart.products.push({ product: cleanProductId, quantity: 1 });
            }

            await cart.save();
            return cart;
        } catch (error) {
            console.log("Error al agregar producto al carrito:", error);
            throw new ErrorManager("Error al agregar producto al carrito", 500);
        }
    }

    async deleteOneProduct(id, productId) {
        try {
            const cart = await this.#findOneById(id);
            const productIndex = cart.products.findIndex((item) => item.product._id.toString() === productId);

            if (productIndex >= 1) {
                cart.products[productIndex].quantity--;
            } else {
                cart.products.push({ product: productId, quantity: -1 });
            }

            await cart.save();

            return cart;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }
}