"use client";

import { Heading } from "@/components/Heading"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import type { ReactNode } from "react"
import { useNavigate } from "react-router-dom";

interface DashboardLayoutProps {
    title: string
    children?: ReactNode
    hideBackButton?: boolean
    cta?: ReactNode
}


export const DashboardLayout = ({
    title,
    children,
    hideBackButton,
    cta
}: DashboardLayoutProps) => {
    const navigate = useNavigate();
    

    return (
        <section className="flex-1 h-screen w-full flex flex-col">
            <div className="w-full p-6 sm:p-8 flex justify-between border-b border-gray-200">
                <div className="w-full flex flex-col sm:flex-row sm:items-center sm:gap-x-6 items-start gap-y-6">
                    <div className="flex items-center gap-4">
                        {hideBackButton ? null : 
                        (
                            <Button className="w-fit bg-white" variant="outline" onClick={() => navigate("/dashboard")}>
                                <ArrowLeft className="size-4"/>
                            </Button>
                        )}

                        <Heading>{title}</Heading>
                    </div> 

                    {cta ? <div className="w-full">{cta}</div> : null}
                </div>
            </div>
            
            <div className="flex-1 p-6 sm:p-8 flex flex-col overflow-y-auto">
                {children}
            </div>
        </section>
    )

}