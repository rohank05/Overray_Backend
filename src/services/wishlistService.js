import schemas from "../database/schemas/index.js";
import { GraphQLError } from "graphql";

/**
 * Wishlist service for handling wishlist-related business logic
 */
class WishlistService {
    /**
     * Add a product to user's wishlist
     * @param {string} userId - User ID
     * @param {string} productId - Product ID
     * @returns {Object} Updated wishlist
     */
    async addProductToWishlist(userId, productId) {
        // Validate product_id
        if (!productId) {
            throw new GraphQLError("Product ID is required", {
                extensions: { code: "BAD_USER_INPUT" },
            });
        }

        // Verify product exists
        const product = await schemas.product.findById(productId);
        if (!product) {
            throw new GraphQLError("Product not found", {
                extensions: { code: "NOT_FOUND" },
            });
        }

        let wishlist = await schemas.wishlist.findOne({ user_id: userId });

        if (!wishlist) {
            wishlist = new schemas.wishlist({
                user_id: userId,
                products: [productId],
            });
            return await wishlist.save();
        }

        // Check if product already exists in wishlist
        const productExists = wishlist.products.some(
            existingProductId => existingProductId.toString() === productId.toString(),
        );

        if (productExists) {
            throw new GraphQLError("Product already in wishlist", {
                extensions: { code: "DUPLICATE_ENTRY" },
            });
        }

        wishlist.products.push(productId);
        return await wishlist.save();
    }

    /**
     * Remove a product from user's wishlist
     * @param {string} userId - User ID
     * @param {string} productId - Product ID
     * @returns {Object} Updated wishlist
     */
    async removeProductFromWishlist(userId, productId) {
        if (!productId) {
            throw new GraphQLError("Product ID is required", {
                extensions: { code: "BAD_USER_INPUT" },
            });
        }

        const result = await schemas.wishlist.findOneAndUpdate(
            { user_id: userId },
            { $pull: { products: productId } },
            { new: true, useFindAndModify: false },
        );

        if (!result) {
            throw new GraphQLError("Wishlist not found", {
                extensions: { code: "NOT_FOUND" },
            });
        }

        return result;
    }

    /**
     * Get user's wishlist with populated product details
     * @param {string} userId - User ID
     * @returns {Object} Wishlist with product details
     */
    async getUserWishlist(userId) {
        const wishlist = await schemas.wishlist
            .findOne({ user_id: userId })
            .populate({
                path: "products",
                populate: [
                    { path: "categories" },
                    { path: "product_images" },
                ],
            })
            .exec();

        return wishlist;
    }

    /**
     * Check if product is in user's wishlist
     * @param {string} userId - User ID
     * @param {string} productId - Product ID
     * @returns {boolean} Whether product is in wishlist
     */
    async isProductInWishlist(userId, productId) {
        const wishlist = await schemas.wishlist.findOne({
            user_id: userId,
            products: productId,
        });

        return !!wishlist;
    }

    /**
     * Clear user's wishlist
     * @param {string} userId - User ID
     * @returns {boolean} Success status
     */
    async clearWishlist(userId) {
        const result = await schemas.wishlist.findOneAndUpdate(
            { user_id: userId },
            { $set: { products: [] } },
            { new: true },
        );

        return !!result;
    }
}

export default new WishlistService();
