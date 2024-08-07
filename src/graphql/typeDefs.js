export const typeDefs = `#graphql
    type Address {
        _id: ID!,
        address_line_1: String!,
        address_line_2: String!,
        landmark: String,
        pincode: Int!
    }
    type ProductImage {
        _id: ID!,
        product_id: String,
        image_name: String
    }
    type User {
        name: String!,
        picture: String
    }
    type AddedReview {
        user_id: String,
        review: String,
        score: Float,
        product_id: String
    }
    type Review {
        user_id: User,
        review: String,
        score: Float
    }
    type Product {
        _id: ID!,
        name: String!,
        code: String!,
        price: Int!,
        description: String!,
        discount: Int!,
        parent_id: String,
        categories: [Category!]!,
        default_image: String,
        product_images: [ProductImage],
        reviews: [Review],
        keywords: [String]
    }
    type Category {
        _id: ID!,
        name: String,
        description: String,
        parent_category: String,
        image: String
    }
    type AddedCartProduct {
        productId: String
        quantity: Int
    }
    type CartProduct {
        productId: Product,
        quantity: Int
    }
    type Cart {
        _id: ID!,
        products: [CartProduct]
    }
    type AddedCart {
        _id: ID!,
        products: [AddedCartProduct]
    }
    type Wishlist {
        _id: ID!,
        products: [Product]
    }
    type AddedWishlist {
        _id: ID!,
        products: [String]
    }
    type Banner {
        _id: ID!,
        name: String,
        banner_image: String,
        banner_type: String
    }
    type Query {
        addresses: [Address]
        products(filter: ProductFilter): [Product]
        cart: Cart
        wishlist: Wishlist
        category: [Category]
        banner: [Banner]
    }
    type Mutation {
        addAddress(address: AddAddressInput!): Address
        addProductToCart(products: CartInput): AddedCart
        removeProductFromCart(product_id: String!): AddedCart
        addProductToWishlist(product_id: String!): AddedWishlist
        removeProductFromWishlist(product_id: String!): AddedWishlist
        addProductReview(review: ReviewInput!): AddedReview
    }
    input AddAddressInput {
        name: String!,
        address_line_1: String!,
        address_line_2: String!,
        landmark: String!,
        pincode: Int!
    }
    input SortInput {
        field: String!,
        order: String! 
    }
    input ProductFilter {
        _id: ID,
        name: String,
        categories: [ID!],
        minPrice: Float,
        maxPrice: Float,
        sort: SortInput,
        start: Int,
        limit: Int,
        code: String,
        keywords: [String]
    }
    input ReviewInput {
        review: String,
        score: Float,
        product_id: String
    }
    input CartInput {
        product_id: ID!
        quantity: Int
    }
`;
