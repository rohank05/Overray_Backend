import { Schema, Types, model } from "mongoose";

const orderSchema = new Schema({
    user_id: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
    },
    products: [
        {
            product_id: {
                type: Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            },
            price: {
                type: Number,
                required: true,
            },
            discount: {
                type: Number,
                required: false,
                default: 0,
            },
        },
    ],
    total_amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
        default: "Pending",
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
});

export default model("order", orderSchema);
