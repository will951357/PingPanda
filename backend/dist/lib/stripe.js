"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCheckoutSession = exports.stripe = void 0;
const stripe_1 = __importDefault(require("stripe"));
exports.stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY ?? "", {
    apiVersion: "2025-04-30.basil",
    typescript: true
});
const createCheckoutSession = async ({ userEmail, userId }) => {
    const session = await exports.stripe.checkout.sessions.create({
        line_items: [
            {
                price: "price_1ROIsOFT6Cvm1fbPQHnUPlfK",
                quantity: 1
            }
        ],
        mode: "payment",
        success_url: `${process.env.VITE_URL}/dashbord?success=true`,
        cancel_url: `${process.env.VITE_URL}/pricing`,
        customer_email: userEmail,
        metadata: {
            userId
        }
    });
    return session;
};
exports.createCheckoutSession = createCheckoutSession;
