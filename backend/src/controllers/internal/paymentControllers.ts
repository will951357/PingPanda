import { createCheckoutSession } from "@/lib/stripe";
import { Request, Response } from "express";



export const paymentRoute = async (req: Request, res: Response) => {

    const user = (req as any).userDb;

    
    console.log("paymentRoute", user)

    const session = await createCheckoutSession(
    {
        userEmail: user.email,
        userId: user.id
    }
    );

    res.json({url: session.url});
}