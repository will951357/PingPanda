import { useAuth } from "@clerk/clerk-react";
import { DashboardLayout } from "./components/DashboardLayout"
import { useNavigate } from "react-router-dom";
import { ApiKeySettingsContent } from "./components/ApiKeysPageContent";

export const ApiKeySettingsPage = () => {

    const { isSignedIn } = useAuth();
    const navigate = useNavigate();

    if (!isSignedIn) {
        navigate("/sign-in")
    }

    return (
        <DashboardLayout
            title="API Settings">
            
            <ApiKeySettingsContent apiKey="soa12qpmfpfapsdm"/>

        </DashboardLayout>
    )
}