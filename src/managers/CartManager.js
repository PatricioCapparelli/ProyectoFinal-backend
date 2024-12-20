import { Types } from "mongoose";

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

    async updateCart(cartId, products) {
        try {
            if (!this.isValidId(cartId)) {
                throw new ErrorManager("ID de carrito inválido", 400);
            }

            const cart = await this.#cartModel.findById(cartId);

            if (!cart) {
                throw new ErrorManager("Carrito no encontrado", 404);
            }

            products.forEach((item) => {
                const productIndex = cart.products.findIndex((p) => p.product.toString() === item.productId);

                if (productIndex >= 0) {
                    cart.products[productIndex].quantity = item.quantity;
                } else {
                    cart.products.push({ product: item.productId, quantity: item.quantity });
                }
            });

            await cart.save();

            return cart;
        } catch (error) {
            console.log("Error al modificar el carrito:", error);
            throw new ErrorManager("Error al modificar el carrito", 500);
        }
    }

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

    async deleteOneProduct(cartId, productId) {
        try {
            const cleanProductId = productId.trim();

            if (!this.isValidId(cartId) || !this.isValidId(cleanProductId)) {
                throw new ErrorManager("ID inválido", 400);
            }

            const cart = await this.#findOneById(cartId);

            const productIndex = cart.products.findIndex((item) => item.product._id.toString() === cleanProductId);

            if (productIndex === -1) {
                throw new ErrorManager("Producto no encontrado en el carrito", 404);
            }

            if (cart.products[productIndex].quantity > 1) {
                cart.products[productIndex].quantity--;
            } else {
                cart.products.splice(productIndex, 1);
            }

            await cart.save();

            return cart;
        } catch (error) {
            console.log("Error al eliminar producto del carrito:", error);
            throw new ErrorManager("Error al eliminar producto del carrito", 500);
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