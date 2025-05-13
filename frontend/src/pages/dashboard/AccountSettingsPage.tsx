import { useAuth } from "@clerk/clerk-react";
import { DashboardLayout } from "./components/DashboardLayout"
import { useNavigate } from "react-router-dom";
import { AccountSettingsContent } from "./components/SettingsPageContent";

export const AccountSettingsPage = () => {

    const { isSignedIn } = useAuth();
    const navigate = useNavigate();

    if (!isSignedIn) {
        navigate("/sign-in")
    }

    return (
        <DashboardLayout
            title="Account Settings">
            
            <AccountSettingsContent discordId="113nf10tnit0oa"/>

        </DashboardLayout>
    )
}