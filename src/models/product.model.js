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
    thumbnail: {
        type: String,
        trim: true,
    },
    category: {
        type: String,
        enum: {
            values: [ "masculino", "femenino", "unisex" ],
            message: "La categoría debe ser 'masculino', 'femenino' o 'unisex'",
        },
        required: [ true, "La categoría es obligatoria" ],
        trim: true,
    },
    available: {
        type: Boolean,
        required: [ true, "La disponibilidad es obligatoria" ],
    },
}, {
    timestamps: true,
    versionKey: false,
});

productSchema.plugin(paginate);

const ProductModel = model("product", productSchema);

export default ProductModel;