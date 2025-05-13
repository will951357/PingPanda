"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRoute = void 0;
const stripe_1 = require("@/lib/stripe");
const paymentRoute = async (req, res) => {
    const user = req.userDb;
    console.log("paymentRoute", user);
    const session = await (0, stripe_1.createCheckoutSession)({
        userEmail: user.email,
        userId: user.id
    });
    res.json({ url: session.url });
};
exports.paymentRoute = paymentRoute;
