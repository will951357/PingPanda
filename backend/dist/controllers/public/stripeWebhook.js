"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stripe_1 = require("@/lib/stripe");
const db_1 = require("@/db");
const consumers_1 = require("stream/consumers");
const endpoint_secret = process.env.STRIPE_WEBHOOK_SECRET;
const stripeWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;
    try {
        const buf = await (0, consumers_1.buffer)(req);
        event = stripe_1.stripe.webhooks.constructEvent(buf, sig, endpoint_secret);
    }
    catch (err) {
        console.error("Webhook error \n", err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
    // tratar os eventos
    switch (event?.type) {
        case "checkout.session.completed":
            const session = event.data.object;
            const { userId } = session.metadata || { userId: null };
            if (!userId) {
                res.status(400).json({ message: "Invalid Metadata" });
                return;
            }
            await db_1.db.user.update({
                where: { id: userId },
                data: { plan: "PRO" }
            });
            res.status(200).json({ message: "OK" });
            return;
        default:
            console.log(`Unhandled event type ${event?.type}`);
    }
    res.status(400).json({ message: "Erro ao processar pagamento" });
};
