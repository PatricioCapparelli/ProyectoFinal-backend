import paths from "../utils/paths.js";
import { readJsonFile, writeJsonFile } from "../utils/fileHandler.js";
import { generateId } from "../utils/collectionHandler.js";
import { convertToBoolean } from "../utils/converter.js";
import ErrorManager from "./errorManager.js";

export default class ProductManager {
    #jsonFilename;
    #products;

    constructor() {
        this.#jsonFilename = "products.json";
    }

    async getAll() {
        try {
            // lee todos los productos guardados en el json.
            this.#products = await readJsonFile(paths.files, this.#jsonFilename);
            return this.#products;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    // Busca un producto por su ID

    async #findOneById(id) {
        this.#products = await this.getAll();
        const productFound = this.#products.find((item) => item.id === Number(id));

        if (!productFound) {
            throw new ErrorManager("ID no encontrado", 404);
        }

        return productFound;
    }

    // Obtiene un producto especifico por su ID

    async getOneById(id) {
        try {
            const productFound = await this.#findOneById(id);
            return productFound;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    // Agrega un producto

    async insertOne(data) {
        try {
            const { title, status, stock, price } = data;

            if (!title || !stock || !price) {
                throw new ErrorManager("Faltan datos obligatorios", 400);
            }

            if (!isNaN(title)) {
                throw new ErrorManager("Introduzca un nombre valido", 400);
            }

            const product = {
                id: generateId(await this.getAll()),
                title,
                price: Number(price),
                status: convertToBoolean(status),
                stock: Number(stock),
            };

            this.#products.push(product);
            // Envia el contenido al json con la funcion write.
            await writeJsonFile(paths.files, this.#jsonFilename, this.#products);

            return product;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    // Actualiza un producto en especifico

    async updateOneById(id, data) {
        try {
            const { title, description, code, price, status, stock, category } = data;
            const productFound = await this.#findOneById(id);

            const product = {
                ...productFound,
                title: title || productFound.title,
                description: description || productFound.description,
                code: code || productFound.code,
                price: price ? Number(price) : productFound.price,
                status: status ? convertToBoolean(status) : productFound.status,
                stock: stock ? Number(stock) : productFound.stock,
                category: category || productFound.category,
            };

            const index = this.#products.findIndex((item) => item.id === Number(id));
            this.#products[index] = product;
            await writeJsonFile(paths.files, this.#jsonFilename, this.#products);

            return product;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    // Elimina un producto en especifico

    async deleteOneById(id) {
        try {
            const index = this.#products.findIndex((item) => item.id === Number(id));

            if (index === -1) {
                throw new Error("Producto no encontrado.");
            }

            this.#products.splice(index, 1);
            await writeJsonFile(paths.files, this.#jsonFilename, this.#products);

        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

}