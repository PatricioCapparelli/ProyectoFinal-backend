import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const cartSchema = new Schema({
    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: "products",
                required: [ true, "El nombre del producto es obligatorio" ],
            },
            quantity: {
                type: Number,
                required: [ true, "La cantidad del producto es obligatoria" ],
                min: [ 1, "La cantidad debe ser mayor que 0" ],
            },
            _id: false,
        },
    ],
}, {
    timestamps: true,
    versionKey: false,
});

cartSchema.plugin(paginate);

const CartModel = model("carts", cartSchema);

export default CartModel;