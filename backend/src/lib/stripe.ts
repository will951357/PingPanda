import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
    apiVersion:"2025-04-30.basil",
    typescript:true
})


export const createCheckoutSession = async({
    userEmail,
    userId
}: {userEmail: string, userId: string}
) => {
    const session = await stripe.checkout.sessions.create(
        {
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

        }
    )

    return session
}