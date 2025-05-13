import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { getSingleUser } from "@/lib/api";
import { useAuth } from "@clerk/clerk-react";
import { CheckIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const PaymentSuccessModal = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [plan, setPlan] = useState("");
    const navegate = useNavigate();
    const {getToken} = useAuth();

    useEffect(() => {
        let interval: NodeJS.Timeout;
        
        const startSyncInterval = async () => {
            interval = setInterval(async () => {
                try {
                    const token = await getToken();
                    const res = await getSingleUser(token!);
                    if (res) {
                        setPlan(res.plan)
                        if (res.plan === "PRO") {
                            clearInterval(interval);
                        }
                        }
                } catch (error) {
                    console.error("Failed to sync user:", error);
                }
            }, 1000) 
        }

        startSyncInterval();
        return () => clearInterval(interval); 

    }, [])
    
    const handleClose = () => {
        setIsOpen(false)
        navegate("/dashboard")
    }

    const isPaymentSuccefull = plan === "PRO"

    return (
        <Modal showModal={isOpen} setShowModal={setIsOpen} onClose={handleClose} className="px-6 pt-6" preventDefaultClose={!isPaymentSuccefull}>
            <div className="flex flex-col items-center">
                {!isPaymentSuccefull ? (
                    <div className="flex flex-col items-center justify-center h-64">
                        <LoadingSpinner className="mb-4" />
                        <p className="text-lg/7 font-medium text-gray-900">
                            Upgrating your account...
                        </p>
                        <p className="text-gray-600 text-sm/6 mt-2 text-center text-pretty">
                            Please wait while we process your upgrade. This may take a moment.
                        </p>
                    </div>
                ): 
                <>
                    <div className="relative aspect-video border border-gray-200 w-dull overflow-hidden rounded-lg bg-gray-50">
                        <img src="/brand-asset-heart.png" alt="heart" className="h-full w-full object-cover" />
                    </div>

                    <div className="mt-6 flex flex-col items-center gap-2 text-center">
                        <p className="text-lg/7 tracking-tight font-medium text-pretty">
                            Upgrade Successfull!
                        </p>
                        <p className="text-gray-600 text-sm/6 text-pretty">
                            Thank you for Upgrating to Pro and supporting PingPanda
                        </p>
                    </div>

                    <div className=" mt-8 w-full">
                        <Button
                        onClick={handleClose}
                        className="h-12 w-full"> 
                            <CheckIcon/>
                            Go to Dashboard
                        </Button>
                    </div>
                </>}
            </div>
        </Modal>
    )


}