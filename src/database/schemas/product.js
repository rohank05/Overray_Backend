import { Schema, Types, model } from "mongoose";

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    sku: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    long_description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    size: {
        type: String,
        required: true,
    },
    categories: [
        {
            type: Types.ObjectId,
            ref: "category",
            required: true,
        },
    ],
    product_images: [
        {
            type: Types.ObjectId,
            ref: "product_img",
        },
    ],
    default_image: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    reviews: [
        {
            type: Types.ObjectId,
            ref: "product_review",
        },
    ],
    weight: {
        type: Number,
        required: true,
    },
    keywords: [
        {
            type: String,
        },
    ],
    created_on: {
        type: Date,
        default: Date.now,
    },
});

productSchema.index({
    name: "text",
    description: "text",
    long_description: "text",
    keywords: "text",
});

export default model("product", productSchema);
