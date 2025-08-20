import Joi from "joi";

/**
 * Validation schemas for GraphQL inputs
 */

export const productValidation = {
    productId: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            "string.pattern.base": "Product ID must be a valid MongoDB ObjectId",
            "any.required": "Product ID is required",
        }),

    quantity: Joi.number()
        .integer()
        .min(1)
        .max(999)
        .default(1)
        .messages({
            "number.min": "Quantity must be at least 1",
            "number.max": "Quantity cannot exceed 999",
            "number.integer": "Quantity must be a whole number",
        }),
};

export const cartValidation = {
    addToCart: Joi.object({
        product_id: productValidation.productId,
        quantity: productValidation.quantity,
    }),

    removeFromCart: Joi.object({
        product_id: productValidation.productId,
    }),
};

export const wishlistValidation = {
    addToWishlist: Joi.object({
        product_id: productValidation.productId,
    }),

    removeFromWishlist: Joi.object({
        product_id: productValidation.productId,
    }),
};

export const addressValidation = {
    addAddress: Joi.object({
        street: Joi.string().min(3).max(255).required(),
        city: Joi.string().min(2).max(100).required(),
        state: Joi.string().min(2).max(100).required(),
        pincode: Joi.string().pattern(/^[0-9]{6}$/).required().messages({
            "string.pattern.base": "Pincode must be 6 digits",
        }),
        country: Joi.string().min(2).max(100).default("India"),
        landmark: Joi.string().max(255).optional(),
        address_type: Joi.string().valid("home", "work", "other").default("home"),
    }),

    removeAddress: Joi.object({
        address_id: Joi.string()
            .pattern(/^[0-9a-fA-F]{24}$/)
            .required()
            .messages({
                "string.pattern.base": "Address ID must be a valid MongoDB ObjectId",
            }),
    }),
};

export const reviewValidation = {
    addReview: Joi.object({
        product_id: productValidation.productId,
        review: Joi.string().min(10).max(1000).required().messages({
            "string.min": "Review must be at least 10 characters long",
            "string.max": "Review cannot exceed 1000 characters",
        }),
        score: Joi.number().min(1).max(5).required().messages({
            "number.min": "Score must be between 1 and 5",
            "number.max": "Score must be between 1 and 5",
        }),
    }),
};

export const paginationValidation = {
    pagination: Joi.object({
        start: Joi.number().integer().min(0).default(0),
        limit: Joi.number().integer().min(1).max(100).default(10),
        sort: Joi.object().optional(),
        filter: Joi.object().optional(),
    }),
};

/**
 * Validate input against a Joi schema
 * @param {Object} input - Input to validate
 * @param {Object} schema - Joi validation schema
 * @throws {GraphQLError} If validation fails
 * @returns {Object} Validated and sanitized input
 */
export const validateInput = (input, schema) => {
    const { error, value } = schema.validate(input, {
        abortEarly: false,
        stripUnknown: true,
    });

    if (error) {
        const errorMessage = error.details.map(detail => detail.message).join(", ");
        throw new Error(`Validation failed: ${errorMessage}`);
    }

    return value;
};
