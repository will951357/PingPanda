import { Card } from "@/components/ui/card"
import { BarChart } from "lucide-react"
import { getQuota, getStripeRoute } from "@/lib/api"
import { useEffect, useState } from "react"
import { useAuth } from "@clerk/clerk-react"
import type { UserQuota } from "@/types/types"
import { format } from "date-fns"


export const UpgradePageContent = ({plan}: {plan: string}) => {

    const [quota, setQuota] = useState<UserQuota>();
    const {getToken} = useAuth();
    
    const createCheckoutSession = async () => {
        const token = await getToken();

        const route = await getStripeRoute(token!)
    }

    const fetchQuota = async () => {
        const token = await getToken(); 
        const getUserQuota = await getQuota(token!);

        setQuota(getUserQuota)
    }
   
    useEffect(()=> {
        fetchQuota()
    }, [])

    return (
        <div className="max-w-3xl flex flex-col gap-8">
            <div className="">
                <h1 className="mt-2 text-xl/8 font-medium tracking-tight text-gray-900">
                    {plan === "PRO" ? "Plan: Pro": "Plan: Free"}
                </h1>
                <p className="text-sm/6 text-gray-600 max-w-prose">
                    {plan === "PRO" ? "Thank you for suporting PingPanda. Find your increased usage limits bellow.": "Get access to more events, gategory and Premium Suport"}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-2 border-brand-850 rounded-lg hover:border-brand-200">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <p className="text-sm/6 font-medium">Total Events</p>
                        <BarChart className="size-4"/>  
                    </div>  

                    <div>
                        <p className="text-2xl font-bold">{quota?.eventsUsed || 0} of {quota?.eventsLimit || 100}</p>
                        <p className="text-xm/5 text-muted-foreground text-pretty">
                            Events this Period
                        </p>
                    </div>
                </Card>  
                <Card className="rounded-lg hover:border-brand-200">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <p className="text-sm/6 font-medium">Events Categories</p>
                        <BarChart className="size-4"/>  
                    </div>  

                    <div>
                        <p className="text-2xl font-bold">{quota?.categoriesUsed || 0} of {quota?.categoriesLimit || 100}</p>
                        <p className="text-xm/5 text-muted-foreground text-pretty">
                            Active categories
                        </p>
                    </div>
                </Card>  
            </div>
            <p className="">
                Usage will reset {" "}{quota?.resetDate ? format(quota.resetDate, "MMM d, yyyy"): (
                    <span className="animate-pulse w-8 h-4 bg-gray-400"> </span>
                )}
                {" "} {plan !== "PRO" ? (
                <span
                onClick={() => createCheckoutSession()}
                className="inline cursor-pointer underline text-brand-600 ">or upgrade now to increse your limits &rarr; {" "}</span> ): null}
            </p>
        </div>
    )
}