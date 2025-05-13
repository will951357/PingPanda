import { useAuth } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import { DashboardLayout } from "./components/DashboardLayout";
import { DashboardContent } from "./components/DashboardContent";
import { CreateEventsCategoryModal } from "./components/CreateEventsCategoryModal";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { getStripeRoute } from "@/lib/api";
import { PaymentSuccessModal } from "./components/PaymentSuccessModal";

interface PageProps {
  searchParams?: {
    [key: string]: string | string[] | undefined
  }
}

const DashboardPage = () => {
    const { isSignedIn, getToken } = useAuth();
    const navigate = useNavigate();
        
    const createCheckoutSession = async () => {
        const token = await getToken();

        const route = await getStripeRoute(token!)
    }

    const searchParams = useLocation();
    const queryParams = new URLSearchParams(location.search);

    if (!isSignedIn) {
        navigate("/sign-in")
    }

    const intent = queryParams.get("intent")

    if (intent) {
      createCheckoutSession()
    }

    const success = queryParams.get("success")

    return (
      <>  
        {success ? <PaymentSuccessModal /> : null}
      
        <DashboardLayout cta={
            <CreateEventsCategoryModal>
              <Button className="w-full sm:w-fit">
                <PlusIcon className="size-4 mr-2" />
                Add Category
              </Button>
            </CreateEventsCategoryModal>
          }
          title="Dashboard">
            <DashboardContent  />
        </DashboardLayout>
      </>
    )

}


export default DashboardPage