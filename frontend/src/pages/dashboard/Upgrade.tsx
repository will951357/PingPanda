import { useAuth } from "@clerk/clerk-react";
import { DashboardLayout } from "./components/DashboardLayout"
import { UpgradePageContent } from "./components/upgradePageContent"
import { useNavigate } from "react-router-dom";

export const UpgradePage = () => {

    const { isSignedIn } = useAuth();
    const navigate = useNavigate();

    if (!isSignedIn) {
        navigate("/sign-in")
    }

    return (
        <DashboardLayout
            title="Plan Manegment">
            
            <UpgradePageContent plan="FREE" />

        </DashboardLayout>
    )
}