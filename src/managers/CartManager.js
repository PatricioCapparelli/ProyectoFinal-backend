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

    async updateCart(cartId, products) {
        try {
            // Verificamos que el cartId sea válido
            if (!this.isValidId(cartId)) {
                throw new ErrorManager("ID de carrito inválido", 400);
            }

            // Buscamos el carrito por ID
            const cart = await this.#cartModel.findById(cartId);

            if (!cart) {
                throw new ErrorManager("Carrito no encontrado", 404);
            }

            // Actualizamos los productos del carrito
            products.forEach((item) => {
                const productIndex = cart.products.findIndex((p) => p.product.toString() === item.productId);

                if (productIndex >= 0) {
                    // Si el producto ya existe en el carrito, actualizamos la cantidad
                    cart.products[productIndex].quantity = item.quantity;
                } else {
                    // Si el producto no existe, lo agregamos al carrito
                    cart.products.push({ product: item.productId, quantity: item.quantity });
                }
            });

            // Guardamos los cambios en el carrito
            await cart.save();

            return cart;
        } catch (error) {
            console.log("Error al modificar el carrito:", error);
            throw new ErrorManager("Error al modificar el carrito", 500);
        }
    }

    isValidId(id) {
        return mongoose.Types.ObjectId.isValid(id);
    }

    async addOneProduct(cartId, productId, quantity) {
        try {
            // Verifica que los IDs sean válidos
            if (!this.isValidId(cartId) || !this.isValidId(productId)) {
                throw new ErrorManager("ID inválido", 400);
            }

            // Busca el carrito y el producto
            const cart = await this.#cartModel.findById(cartId);
            const product = await ProductModel.findById(productId);

            if (!product) {
                throw new ErrorManager("Producto no encontrado", 404);
            }

            // Busca si el producto ya existe en el carrito
            const productIndex = cart.products.findIndex(
                (item) => item.product.toString() === productId,
            );

            if (productIndex >= 0) {
                // Si el producto ya está en el carrito, establece la cantidad especificada
                cart.products[productIndex].quantity = quantity;
            } else {
                // Si no existe, lo agrega con la cantidad especificada
                cart.products.push({ product: productId, quantity });
            }

            // Guarda el carrito actualizado
            await cart.save();
            return cart;
        } catch (error) {
            console.log("Error al modificar el carrito:", error);
            throw new ErrorManager("Error al modificar el carrito", 500);
        }
    }

    async deleteOneProduct(cartId, productId) {
        try {
            // Elimina los saltos de línea u otros caracteres adicionales del ID
            const cleanProductId = productId.trim(); // Elimina espacios u otros caracteres no deseados

            // Verifica que ambos IDs sean válidos
            if (!this.isValidId(cartId) || !this.isValidId(cleanProductId)) {
                throw new ErrorManager("ID inválido", 400);
            }

            // Buscar el carrito por su ID
            const cart = await this.#findOneById(cartId);

            // Buscar el índice del producto en el carrito
            const productIndex = cart.products.findIndex((item) => item.product._id.toString() === cleanProductId);

            if (productIndex === -1) {
                throw new ErrorManager("Producto no encontrado en el carrito", 404);
            }

            // Decrementar la cantidad o eliminar el producto si la cantidad llega a 0
            if (cart.products[productIndex].quantity > 1) {
                cart.products[productIndex].quantity--; // Decrementa la cantidad si es mayor a 1
            } else {
                cart.products.splice(productIndex, 1); // Elimina el producto si la cantidad es 0
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
            // Elimina los saltos de línea u otros caracteres adicionales del ID
            const cleanCartId = cartId.trim(); // Elimina espacios u otros caracteres no deseados

            // Verifica que el cartId sea válido
            if (!this.isValidId(cleanCartId)) {
                throw new ErrorManager("ID de carrito inválido", 400);
            }

            // Buscar el carrito por su ID
            const cart = await this.#findOneById(cleanCartId);

            // Si el carrito no tiene productos, lanzamos un error
            if (cart.products.length === 0) {
                throw new ErrorManager("El carrito está vacío", 400);
            }

            // Limpiar todos los productos del carrito
            cart.products = []; // Elimina todos los productos

            // Guardar los cambios en el carrito
            await cart.save();

            return cart;
        } catch (error) {
            console.log("Error al eliminar todos los productos del carrito:", error);
            throw new ErrorManager("Error al eliminar todos los productos del carrito", 500);
        }
    }

}