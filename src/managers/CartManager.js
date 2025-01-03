import ErrorManager from "./ErrorManager.js";
import CartModel from "../models/cart.model.js";
import { isValidId } from "../config/mongoose.config.js";

export default class CartManager {
    #cartModel;

    constructor() {
        this.#cartModel = CartModel;
    }

    #validateId = (id) => {
        if (!isValidId(id)) throw new ErrorManager("ID invalido", 400);
    };

    async #findOneById(id) {
        this.#validateId(id);

        const cartFound = await this.#cartModel.findOne({ _id: id }).populate("products.product");
        if (!cartFound) throw new ErrorManager("ID no encontrado", 400);

        return cartFound;
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

    // correccion reentrega!
    updateOneById = async (id, data) => {
        try {
            const cartFound = await this.#findOneById(id);

            cartFound.set(data);
            await cartFound.save();
            return cartFound.toObject();
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    };

    addOneProduct = async (id, productId, quantity = 0) => {
        try {
            const cartFound = await this.#findOneById(id);

            const productIndex = cartFound.products.findIndex((item) => item.product._id.toString() === productId);

            if (productIndex >= 0) {
                cartFound.products[productIndex].quantity += quantity;
            } else {
                cartFound.products.push({ product: productId, quantity });
            }

            await cartFound.save();
            return cartFound.toObject();
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    };

    deleteOneProduct = async (id, productId, quantity = 0) => {
        try {
            const cartFound = await this.#findOneById(id);

            const productIndex = cartFound.products.findIndex((item) => item.product._id.toString() === productId);
            if (productIndex < 0) {
                throw new Error("Producto no encontrado en el carrito");
            }

            if (cartFound.products[productIndex].quantity > quantity) {
                cartFound.products[productIndex].quantity -= quantity;
            } else {
                cartFound.products.splice(productIndex, 1);
            }

            await cartFound.save();
            return cartFound.toObject();
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    };

    // Elimina todos los productos de un carrito por su ID
    deleteAllProducts = async (id) => {
        try {
            const cartFound = await this.#findOneById(id);
            cartFound.products = [];

            await cartFound.save();
            return cartFound.toObject();
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    };

}