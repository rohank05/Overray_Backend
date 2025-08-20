import securityUser from "./security_user.js";
import user from "./user.js";
import address from "./address.js";
import product from "./product.js";
import category from "./category.js";
import coupon from "./coupon.js";
import order from "./order.js";
import productImage from "./product_image.js";
import cart from "./cart.js";
import wishlist from "./wishlist.js";
import banner from "./banner.js";
import productReview from "./product_review.js";
import lookup from "./lookup.js";
import emailQueue from "./email_queue.js";
import emailRecipient from "./email_recipient.js";
import resetPassword from "./reset_password.js";
import deviceToken from "./device_token.js";
import blockedToken from "./blocked_token.js";

export default {
    security_user: securityUser,
    user,
    address,
    product,
    category,
    coupon,
    order,
    product_image: productImage,
    cart,
    wishlist,
    banner,
    product_review: productReview,
    lookup,
    email_queue: emailQueue,
    email_recipient: emailRecipient,
    reset_password: resetPassword,
    device_token: deviceToken,
    blocked_token: blockedToken,
};
