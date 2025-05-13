"use client";

import { SignUp } from "@clerk/clerk-react";

const SignUpPage = () => {
    return (
        <div className="w-full flex-1 flex items-center justify-center">
            <SignUp 
                redirectUrl="/welcome"
                fallbackRedirectUrl="/welcome"          
            />
        </div>
    )
}

export default SignUpPage