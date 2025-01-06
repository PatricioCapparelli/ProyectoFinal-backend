import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const productSchema = new Schema({
    title: {
        index: { name: "idx_title" },
        type: String,
        required: [ true, "El nombre es obligatorio" ],
        uppercase: true,
        trim: true,
        minLength: [ 3, "El nombre debe tener al menos 3 caracteres" ],
        maxLength: [ 25, "El nombre debe tener como máximo 25 caracteres" ],
    },
    status: {
        type: Boolean,
        required: [ true, "El estado es obligatorio" ],
    },
    stock: {
        type: Number,
        required: [ true, "El stock es obligatorio" ],
        min: [ 0, "El stock debe ser un valor positivo" ],
    },
    price: {
        type: Number,
        required: [ true, "El precio es obligatorio" ],
        min: [ 0, "El precio debe ser un valor positivo" ],
    },
    category: {
        type: String,
        trim: true,
        enum: {
            values: [ "MASCULINO", "FEMENINO", "UNISEX" ],
            message: "La categoría debe ser 'masculino', 'femenino' o 'unisex'",
        },
        required: [ true, "La categoría es obligatoria" ],
    },
    availability: {
        type: Boolean,
        required: [ true, "La disponibilidad es obligatoria" ],
    },
    description: {
        type: String,
        trim: true,
    },
    code: {
        type: String,
        required: [ true, "El código es obligatorio" ],
        uppercase: true,
        trim: true,
        unique: true,
        validate: {
            validator: async function (code) {
                const countDocuments = await this.model("products").countDocuments({
                    _id: { $ne: this._id },
                    code, // Atributo de verificación de duplicado
                });
                return countDocuments === 0;
            },
            message: "El código ya está registrado",
        },
    },
    thumbnail: {
        type: String,
        required: [ true, "La imagen es obligatoria" ],
        trim: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});

// Middleware que elimina la referencia en los carritos al eliminar el producto.
productSchema.pre("deleteOne", async function(next) {
    try {
        const Cart = model("carts");

        await Cart.updateMany(
            { "products.product": this._id },
            { $pull: { products: { product: this._id } } },
        );

        next();
    } catch (error) {
        next(error);
    }
});

productSchema.plugin(paginate);

const ProductModel = model("products", productSchema);

export default ProductModel;