import { Request, Response } from "express";
import { stripe } from "@/lib/stripe";
import { Buffer } from "buffer";
import { db } from "@/db";
import { buffer } from "stream/consumers";
import { any } from "zod";
import Stripe from "stripe";

const endpoint_secret = process.env.STRIPE_WEBHOOK_SECRET!;

const stripeWebhook = async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;

    let event;

    try {
        const buf = await buffer(req);
        event = stripe.webhooks.constructEvent(buf, sig, endpoint_secret)
    } catch (err: any) {
        console.error("Webhook error \n", err.message)
        res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // tratar os eventos

    switch (event?.type) {
        case "checkout.session.completed":
            const session = event.data.object as Stripe.Checkout.Session;
            const { userId } = session.metadata || {userId: null};

            if (!userId) {
                res.status(400).json({message: "Invalid Metadata"});
                return;
            }

            await db.user.update({
                where: {id: userId},
                data: {plan: "PRO"}
            })

            res.status(200).json({message: "OK"})
            return;

        default:
            console.log(`Unhandled event type ${event?.type}`);
    }

    res.status(400).json({message: "Erro ao processar pagamento"})
}