import schemas from "../database/schemas/index.js";
import mongoose from "mongoose";
import { GraphQLError } from "graphql";
import cartService from "../services/cartService.js";
import wishlistService from "../services/wishlistService.js";
import { validateInput, cartValidation, wishlistValidation } from "../validators/inputValidation.js";
import { ERROR_CODES, ERROR_MESSAGES } from "../constants/index.js";
import logger from "../utils/logger.js";

const checkAuthentication = (context) => {
    if (!context.user)
        throw new GraphQLError(ERROR_MESSAGES.UNAUTHORIZED, {
            extensions: {
                code: ERROR_CODES.UNAUTHENTICATED,
                http: { status: 401 },
            },
        });
};

export const resolvers = {
    Query: {
        addresses: async (parent, args, contextValue) => {
            checkAuthentication(contextValue);
            return await schemas.address.find({
                user_id: contextValue.user._id,
            });
        },
        products: async (parent, args) => {
            const filter = {};
            let limit = 10;
            let start = 0;
            let sort = {};
            let textSearchApplied = false;
            let specificCodeProvided = false;

            if (args.filter) {
                const {
                    _id,
                    categories,
                    size,
                    color,
                    minPrice,
                    maxPrice,
                    name,
                    limit: lim,
                    start: strt,
                    sort: sortOption,
                    code,
                    keywords,
                    query,
                } = args.filter;

                if (_id) {
                    filter._id = new mongoose.Types.ObjectId(_id);
                }

                if (name) {
                    filter.name = { $regex: name, $options: "i" };
                }

                if (size) {
                    filter.size = size;
                }

                if (color) {
                    filter.color = color;
                }

                if (code) {
                    filter.code = code;
                    specificCodeProvided = true;
                }

                if (categories && categories.length > 0) {
                    filter.categories = {
                        $in: categories.map(
                            (id) => new mongoose.Types.ObjectId(id),
                        ),
                    };
                }

                if (keywords && keywords.length > 0) {
                    filter.keywords = {
                        $in: keywords,
                    };
                }

                if (minPrice !== undefined || maxPrice !== undefined) {
                    filter.price = {};

                    if (minPrice !== undefined) {
                        filter.price.$gte = minPrice;
                    }

                    if (maxPrice !== undefined) {
                        filter.price.$lte = maxPrice;
                    }
                }

                if (query) {
                    textSearchApplied = true;
                    if (!sortOption) {
                        sort = { score: { $meta: "textScore" } };
                    }
                } else if (sortOption) {
                    sort = {
                        [sortOption.field]: sortOption.order === "asc" ? 1 : -1,
                    };
                }

                if (lim !== undefined) {
                    limit = lim;
                }

                if (strt !== undefined) {
                    start = strt;
                }
            }

            const aggregationPipeline = [];

            // Add $text search as the first stage if textSearchApplied
            if (textSearchApplied) {
                aggregationPipeline.push({
                    $match: { $text: { $search: args.filter.query } },
                });
                aggregationPipeline.push({
                    $addFields: { score: { $meta: "textScore" } },
                });
            }

            // Add the rest of the filter conditions
            aggregationPipeline.push({ $match: filter });

            if (!specificCodeProvided) {
                // If no specific code is provided, group by code
                aggregationPipeline.push(
                    {
                        $group: {
                            _id: "$code",
                            doc: { $first: "$$ROOT" },
                        },
                    },
                    { $replaceRoot: { newRoot: "$doc" } },
                );
            }

            if (Object.keys(sort).length > 0) {
                aggregationPipeline.push({ $sort: sort });
            }

            aggregationPipeline.push({ $skip: start }, { $limit: limit });

            const results = await schemas.product
                .aggregate(aggregationPipeline)
                .exec();

            // Populate the results
            await schemas.product.populate(results, [
                { path: "categories" },
                { path: "product_images" },
                {
                    path: "reviews",
                    populate: [{ path: "user_id" }],
                },
            ]);

            return results;
        },
        cart: async (parent, args, contextValue) => {
            checkAuthentication(contextValue);
            return await cartService.getUserCart(contextValue.user._id);
        },
        wishlist: async (parent, args, contextValue) => {
            checkAuthentication(contextValue);
            return await wishlistService.getUserWishlist(contextValue.user._id);
        },
        category: async () => {
            return await schemas.category.find().exec();
        },
        banner: async () => {
            return await schemas.banner.find().exec();
        },
        lookup: async () => {
            return await schemas.lookup.find().exec();
        },
        coupons: async (_, { filter }, { _models }) => {
            try {
                const query = {};

                if (filter) {
                    if (filter.is_active !== undefined) {
                        query.is_active = filter.is_active;
                    }

                    if (filter.valid_now) {
                        const now = new Date();
                        query.valid_from = { $lte: now };
                        query.valid_until = { $gte: now };
                    }

                    if (filter.min_discount_value !== undefined) {
                        query.discount_value = {
                            $gte: filter.min_discount_value,
                        };
                    }

                    if (filter.max_discount_value !== undefined) {
                        query.discount_value = {
                            ...query.discount_value,
                            $lte: filter.max_discount_value,
                        };
                    }
                }

                return await schemas.coupon.find(query);
            } catch (error) {
                logger.error("Error fetching coupons:", error);
                throw new Error("Failed to fetch coupons");
            }
        },
        coupon: async (_, { id }, { _models }) => {
            try {
                return await schemas.coupon.findById(id);
            } catch (error) {
                logger.error("Error fetching coupon:", error);
                throw new Error("Failed to fetch coupon");
            }
        },
    },
    Mutation: {
        addAddress: (parent, args, contextValue) => {
            checkAuthentication(contextValue);
            const address = args.address;
            address.user_id = contextValue.user._id;
            return schemas.address.create(address);
        },
        removeAddress: async (parent, args, contextValue) => {
            checkAuthentication(contextValue);
            const deleted = await schemas.address
                .findOneAndDelete({
                    _id: args.address_id,
                    user_id: contextValue.user._id,
                })
                .exec();
            return !!deleted;
        },
        addProductToCart: async (parent, args, contextValue) => {
            checkAuthentication(contextValue);
            const validatedInput = validateInput(args.products, cartValidation.addToCart);
            const { product_id, quantity } = validatedInput;

            return await cartService.addProductToCart(
                contextValue.user._id,
                product_id,
                quantity,
            );
        },
        removeProductFromCart: async (parent, args, contextValue) => {
            checkAuthentication(contextValue);
            const validatedInput = validateInput(args, cartValidation.removeFromCart);

            return await cartService.removeProductFromCart(
                contextValue.user._id,
                validatedInput.product_id,
            );
        },
        addProductToWishlist: async (parent, args, contextValue) => {
            checkAuthentication(contextValue);
            const validatedInput = validateInput(args, wishlistValidation.addToWishlist);

            return await wishlistService.addProductToWishlist(
                contextValue.user._id,
                validatedInput.product_id,
            );
        },
        removeProductFromWishlist: async (parent, args, contextValue) => {
            checkAuthentication(contextValue);
            const validatedInput = validateInput(args, wishlistValidation.removeFromWishlist);

            return await wishlistService.removeProductFromWishlist(
                contextValue.user._id,
                validatedInput.product_id,
            );
        },
        addProductReview: async (parent, args, contextValue) => {
            checkAuthentication(contextValue);
            const { review, score, product_id } = args.review;

            let product_review = await schemas.product_review.findOne({
                user_id: contextValue.user._id,
                product_id: product_id,
            });
            if (!product_review) {
                const newReview = new schemas.product_review({
                    user_id: contextValue.user._id,
                    product_id: product_id,
                    review: review,
                    score: score,
                });
                product_review = await newReview.save();
                return product_review;
            }
            product_review.review = review;
            product_review.score = score;
            product_review = await product_review.save();
            return product_review;
        },
    },
};
