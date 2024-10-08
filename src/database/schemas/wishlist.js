import { Schema, Types, model } from "mongoose";

const wishlistSchema = new Schema({
    user_id: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    products: [
        {
            type: Types.ObjectId,
            ref: "product",
        },
    ],
});

export default model("wishlist", wishlistSchema);
