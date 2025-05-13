"use client";

import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Modal } from "@/components/ui/modal";


export const MainLayout = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <div className="relative h-screen flex flex-col md:flex-row bg-white overflow-hidden">

            {/* Sidebar for larger screens */}
            <div className="hidden md:block w-64 lg:w-80 border-r border-gray-100 p-6 h-full text-brand-900 relative z-10">
                <Sidebar />
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Sidebar */}
                <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200">
                    <p className="text-lg/7 font-semibold text-brand-900">
                        Ping<span className="text-brand-700">Panda</span>
                    </p>

                    <button
                        onClick={()=> setIsDrawerOpen(true)}
                        className="text-gray-500 hover:text-gray-600"
                    >
                        <Menu className="size-6" />  
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto bg-gray-50 shadow-md p-4 md:p-6 relative z-100">
                    <div className="relative min-h-full flex flex-col">
                        <div className="h-full flex flex-col flex-1 space-y-4">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar Drawer */}
            <Modal
                className="p-4"
                showModal={isDrawerOpen}
                setShowModal={setIsDrawerOpen}
            >
                <div className="flex justify-between items-center mb-4">
                    <p className="text-lg/7 font-semibold text-brand-900">
                        Ping<span className="text-brand-700">Panda</span>
                    </p>
            
                    <button
                        aria-label="close-modal"
                        onClick={()=> setIsDrawerOpen(false)}>
                            <X className="size-6" />
                    </button>
                </div>

                <Sidebar/>
            </Modal>

        </div>
    )
}