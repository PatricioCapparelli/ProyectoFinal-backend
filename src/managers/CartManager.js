import { Types } from "mongoose";

import ErrorManager from "./ErrorManager.js";
import CartModel from "../models/cart.model.js";
import ProductModel from "../models/product.model.js";
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
            throw new ErrorManager("ID inválido", 400);
        }
    };

    isValidId(id) {
        console.log("Verificando ID:", id);
        return Types.ObjectId.isValid(id);
    }

    async addOneProduct(cartId, productId) {
        try {

            const cleanCartId = String(cartId).trim();
            const cleanProductId = String(productId).trim();

            console.log("Verificando ID del carrito:", cleanCartId);
            console.log("Verificando ID del producto:", cleanProductId);

            if (!this.isValidId(cleanCartId) || !this.isValidId(cleanProductId)) {
                throw new ErrorManager("ID inválido", 400);
            }

            const cart = await CartModel.findById(cleanCartId);
            if (!cart) {
                throw new ErrorManager("Carrito no encontrado", 404);
            }

            const product = await ProductModel.findById(cleanProductId);
            if (!product) {
                throw new ErrorManager("Producto no encontrado", 404);
            }

            const existingProduct = cart.products.find((p) => p.product.toString() === cleanProductId);
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.products.push({ product: cleanProductId, quantity: 1 });
            }

            await cart.save();

            return cart;
        } catch (error) {
            console.error("Error al agregar producto al carrito:", error);
            throw new ErrorManager("Error al modificar el carrito", error);
        }
    }
    // correccion reentrega!
    async deleteOneProduct(cartId, productId) {
        try {
            const cleanCartId = String(cartId).trim();
            const cleanProductId = String(productId).trim();

            console.log("Verificando ID del carrito:", cleanCartId);
            console.log("Verificando ID del producto:", cleanProductId);

            // Verificar que ambos IDs sean válidos
            if (!this.isValidId(cleanCartId) || !this.isValidId(cleanProductId)) {
                throw new ErrorManager("ID inválido", 400);
            }

            // Buscar el carrito en la base de datos
            const cart = await CartModel.findById(cleanCartId);
            if (!cart) {
                throw new ErrorManager("Carrito no encontrado", 404);
            }

            // Buscar el índice del producto en el carrito
            const productIndex = cart.products.findIndex((item) => item.product.toString() === cleanProductId);

            // Si el producto no se encuentra en el carrito
            if (productIndex === -1) {
                throw new ErrorManager("Producto no encontrado en el carrito", 404);
            }

            // Si el producto tiene más de una unidad, decrementamos la cantidad
            if (cart.products[productIndex].quantity > 1) {
                cart.products[productIndex].quantity--;
            } else {
                // Si la cantidad es 1, eliminamos el producto del carrito
                cart.products.splice(productIndex, 1);
            }

            // Guardar los cambios en el carrito
            await cart.save();

            return cart;
        } catch (error) {
            console.error("Error al eliminar producto del carrito:", error);

            // Enviar una respuesta con un código de estado adecuado y el mensaje de error
            if (error instanceof ErrorManager) {
                return {
                    status: "error",
                    message: error.message,
                    code: error.code,
                };
            } else {
                // Manejar errores inesperados
                return {
                    status: "error",
                    message: "Error inesperado",
                    code: 500,
                };
            }
        }
    }

    async deleteAllProducts(cartId) {
        try {
            const cleanCartId = cartId.trim();

            if (!this.isValidId(cleanCartId)) {
                throw new ErrorManager("ID de carrito inválido", 400);
            }

            const cart = await this.#findOneById(cleanCartId);

            if (cart.products.length === 0) {
                throw new ErrorManager("El carrito está vacío", 400);
            }

            // limpia todos los productos del carrito
            cart.products = [];

            await cart.save();

            return cart;
        } catch (error) {
            console.log("Error al eliminar todos los productos del carrito:", error);
            throw new ErrorManager("Error al eliminar todos los productos del carrito", 500);
        }
    }

}