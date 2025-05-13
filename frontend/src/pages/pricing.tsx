import { Heading } from "@/components/Heading"
import { MaxWidthWrapper } from "@/components/MaxWidthWrapper"
import { Button } from "@/components/ui/button"
import { getStripeRoute } from "@/lib/api"
import { useAuth } from "@clerk/clerk-react"
import { CheckIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Navbar } from "./landing/components/Navbar"

export const PricingPage = () => {

    const { isSignedIn, getToken } = useAuth();
    const navigate = useNavigate();

    const createCheckoutSession = async () => {
        const token = await getToken();
        const route = await getStripeRoute(token!)
    }

    const INCLUDED_FEATURES = [
        "10.000 real-time events per month",
        "10 event categories",
        "Advanced analytics and insights",
        "Priority support",
    ]

    const handleGetAccess = () => { 
        if (isSignedIn) {
            createCheckoutSession()
        } else {
            navigate("/sign-in?intent=upgrade")
        }
    }

    return (
        <>
        
            <Navbar />
            <div className="bg-brand-25 py-24 sm:py-32">
                <MaxWidthWrapper>
                    <div className="mx-auto max-w-2xl sm: text-center">
                        <Heading className="text-center">
                            Simple no-tricks pricing
                        </Heading>
                        <p className="mt-6 text-base/7 text-gray-600 max-w-prose text-center text-pretty">
                            We hate subscriptions. And chances are, you do too, That's why we offer lifetime access to PingPanda for one-time payment
                        </p>
                    </div>

                    <div className="bg-white mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
                        <div className="p-8 sm:p-10 lg:flex-auto">
                            <h3 className="text-3xl font-heading font-semibold tracking-tight text-gray-900">Lifetime Access</h3>
                            <p className="mt-6 text-base/7 text-gray-600">
                                Invest once on PingPanda and transform how you monitor your SaaS forever. Get instant alerts, track critical metrics, and never miss a beat in your business growth.
                            </p>

                            <div className="mt-10 flex items-center gap-x-4">
                                <h4 className="flex-none text-sm font-semibold leading-6 text-brand-600">
                                    What's included
                                </h4>
                                <div className="h-px flex-auto bg-gray-100"/>
                            </div>

                            <ul className="mt-8 grid grid-cols-1 gap-4 text-sm/6 text-gray-600 sm:grid-cols-2 sm:gap-6">
                                {
                                    INCLUDED_FEATURES.map((feature) => (
                                        <li key={feature} className="flex gap-3">
                                            <CheckIcon className="h-6 w-5 flex-none text-brand-700" />
                                            {feature}
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>

                        <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
                            <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
                                <div className="mx-auto max-w-sm py-8">
                                    <p className="text-base font-semibold text-gray-600">
                                        Pay once, own Forever
                                    </p>
                                    <p className="mt-6 flex items-baseline justify-center gap-x-2">
                                        <span className="text-5xl font-bold tracking-tight text-gray-900">
                                            R$49,90
                                        </span>

                                        <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
                                            BRL
                                        </span>
                                    </p>

                                    <Button  onClick={handleGetAccess} className="mt-6 px-20">
                                        Get PingPanda
                                    </Button>
                                    <p className="mt-6 text-xs leading-5 text-gray-600">
                                        Secure Payment. Start monitoring in minutes.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </MaxWidthWrapper>
            </div>
        </>
    )
}