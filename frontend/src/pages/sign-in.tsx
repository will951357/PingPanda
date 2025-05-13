"use client";

import { SignIn } from "@clerk/clerk-react";
import { useParams, useLocation  } from "react-router-dom";

const SignInPage = () => {

    const searchParams = useLocation();
    const queryParams = new URLSearchParams(searchParams.search);

    const intent = queryParams.get("intent")

    return (
        <div className="w-full flex-1 flex items-center justify-center">
            <SignIn forceRedirectUrl={intent ? `/dashboard?intent=${intent}` : "/dashboard"}/>
        </div>
    )
}

export default SignInPage