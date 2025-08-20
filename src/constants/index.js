/**
 * Application constants and configuration
 */

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
};

export const ERROR_CODES = {
    UNAUTHENTICATED: "UNAUTHENTICATED",
    BAD_USER_INPUT: "BAD_USER_INPUT",
    NOT_FOUND: "NOT_FOUND",
    DUPLICATE_ENTRY: "DUPLICATE_ENTRY",
    INSUFFICIENT_STOCK: "INSUFFICIENT_STOCK",
    VALIDATION_ERROR: "VALIDATION_ERROR",
    DATABASE_ERROR: "DATABASE_ERROR",
};

export const ERROR_MESSAGES = {
    PRODUCT_ID_REQUIRED: "Product ID is required",
    PRODUCT_NOT_FOUND: "Product not found",
    QUANTITY_INVALID: "Quantity must be greater than 0",
    CART_NOT_FOUND: "Cart not found",
    WISHLIST_NOT_FOUND: "Wishlist not found",
    PRODUCT_ALREADY_IN_WISHLIST: "Product already in wishlist",
    INSUFFICIENT_STOCK: "Insufficient stock available",
    UNAUTHORIZED: "You are not authorized to perform this action",
    VALIDATION_FAILED: "Input validation failed",
};

export const PAGINATION = {
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
    DEFAULT_START: 0,
};

export const SORT_ORDER = {
    ASC: 1,
    DESC: -1,
    ASCENDING: "asc",
    DESCENDING: "desc",
};

export const ORDER_STATUS = {
    PENDING: "Pending",
    PROCESSING: "Processing",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
    REFUNDED: "Refunded",
};

export const EMAIL_STATUS = {
    PENDING: "pending",
    SENT: "sent",
    FAILED: "failed",
};

export const DISCOUNT_TYPES = {
    PERCENTAGE: "percentage",
    FIXED: "fixed",
    FREE_SHIPPING: "free_shipping",
    FIRST_TIME: "first-time",
};
