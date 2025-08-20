import { describe, it, expect } from "@jest/globals";
import { HTTP_STATUS, ERROR_CODES, ERROR_MESSAGES, PAGINATION } from "../src/constants/index.js";

describe("Constants", () => {
    describe("HTTP_STATUS", () => {
        it("should have correct HTTP status codes", () => {
            expect(HTTP_STATUS.OK).toBe(200);
            expect(HTTP_STATUS.CREATED).toBe(201);
            expect(HTTP_STATUS.BAD_REQUEST).toBe(400);
            expect(HTTP_STATUS.UNAUTHORIZED).toBe(401);
            expect(HTTP_STATUS.NOT_FOUND).toBe(404);
            expect(HTTP_STATUS.INTERNAL_SERVER_ERROR).toBe(500);
        });
    });

    describe("ERROR_CODES", () => {
        it("should have defined error codes", () => {
            expect(ERROR_CODES.UNAUTHENTICATED).toBe("UNAUTHENTICATED");
            expect(ERROR_CODES.BAD_USER_INPUT).toBe("BAD_USER_INPUT");
            expect(ERROR_CODES.NOT_FOUND).toBe("NOT_FOUND");
            expect(ERROR_CODES.DUPLICATE_ENTRY).toBe("DUPLICATE_ENTRY");
            expect(ERROR_CODES.INSUFFICIENT_STOCK).toBe("INSUFFICIENT_STOCK");
        });
    });

    describe("ERROR_MESSAGES", () => {
        it("should have defined error messages", () => {
            expect(ERROR_MESSAGES.PRODUCT_ID_REQUIRED).toBe("Product ID is required");
            expect(ERROR_MESSAGES.PRODUCT_NOT_FOUND).toBe("Product not found");
            expect(ERROR_MESSAGES.CART_NOT_FOUND).toBe("Cart not found");
            expect(ERROR_MESSAGES.WISHLIST_NOT_FOUND).toBe("Wishlist not found");
        });
    });

    describe("PAGINATION", () => {
        it("should have correct pagination defaults", () => {
            expect(PAGINATION.DEFAULT_LIMIT).toBe(10);
            expect(PAGINATION.MAX_LIMIT).toBe(100);
            expect(PAGINATION.DEFAULT_START).toBe(0);
        });
    });
});