import schemas from "../database/schemas/index.js";
import { GraphQLError } from "graphql";

/**
 * Cart service for handling cart-related business logic
 */
class CartService {
    /**
     * Add a product to user's cart
     * @param {string} userId - User ID
     * @param {string} productId - Product ID
     * @param {number} quantity - Product quantity
     * @returns {Object} Updated cart
     */
    async addProductToCart(userId, productId, quantity = 1) {
        // Validate inputs
        if (!productId) {
            throw new GraphQLError("Product ID is required", {
                extensions: { code: "BAD_USER_INPUT" },
            });
        }

        if (quantity <= 0) {
            throw new GraphQLError("Quantity must be greater than 0", {
                extensions: { code: "BAD_USER_INPUT" },
            });
        }

        // Verify product exists and check availability
        const product = await schemas.product.findById(productId);
        if (!product) {
            throw new GraphQLError("Product not found", {
                extensions: { code: "NOT_FOUND" },
            });
        }

        if (quantity > product.quantity) {
            throw new GraphQLError(
                `Only ${product.quantity} items available in stock`,
                { extensions: { code: "INSUFFICIENT_STOCK" } },
            );
        }

        let cart = await schemas.cart.findOne({ user_id: userId });

        if (cart) {
            const existingProductIndex = cart.products.findIndex(
                (x) => x.productId.toString() === productId.toString(),
            );

            if (existingProductIndex !== -1) {
                // Update quantity for existing product
                cart.products[existingProductIndex].quantity = quantity;
            } else {
                // Add new product to cart
                cart.products.push({
                    productId: productId,
                    quantity: quantity,
                });
            }
            return await cart.save();
        }

        // Create new cart
        cart = new schemas.cart({
            user_id: userId,
            products: [
                {
                    productId: productId,
                    quantity: quantity,
                },
            ],
        });
        return await cart.save();
    }

    /**
     * Remove a product from user's cart
     * @param {string} userId - User ID
     * @param {string} productId - Product ID
     * @returns {Object} Updated cart
     */
    async removeProductFromCart(userId, productId) {
        if (!productId) {
            throw new GraphQLError("Product ID is required", {
                extensions: { code: "BAD_USER_INPUT" },
            });
        }

        const result = await schemas.cart.findOneAndUpdate(
            { user_id: userId },
            { $pull: { products: { productId: productId } } },
            { new: true, useFindAndModify: false },
        );

        if (!result) {
            throw new GraphQLError("Cart not found", {
                extensions: { code: "NOT_FOUND" },
            });
        }

        return result;
    }

    /**
     * Get user's cart with populated product details
     * @param {string} userId - User ID
     * @returns {Object} Cart with product details
     */
    async getUserCart(userId) {
        const cart = await schemas.cart
            .findOne({ user_id: userId })
            .populate({
                path: "products.productId",
                populate: [
                    { path: "categories" },
                    { path: "product_images" },
                ],
            })
            .exec();

        return cart;
    }

    /**
     * Clear user's cart
     * @param {string} userId - User ID
     * @returns {boolean} Success status
     */
    async clearCart(userId) {
        const result = await schemas.cart.findOneAndUpdate(
            { user_id: userId },
            { $set: { products: [] } },
            { new: true },
        );

        return !!result;
    }
}

export default new CartService();
