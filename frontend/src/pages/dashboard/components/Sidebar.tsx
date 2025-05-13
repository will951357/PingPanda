import { buttonVariants } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import {Gem, Home, Key, LucideIcon, Menu, Settings, X} from "lucide-react";
import { Link } from "react-router-dom";
import { PropsWithChildren } from "react";
import { Drawer } from "vaul";
import { UserButton } from "@clerk/clerk-react";

interface SidebarItem   {
    href: string;
    icon: LucideIcon;
    text: string;
}

interface SidebarCategory {
    category: string;
    items: SidebarItem[];
}

const SidebarItems: SidebarCategory[] = [
    {
        category: "Overview",
        items: [{ href: "/dashboard", icon: Home, text: "Dashboard"},],
    },
    {
        category: "Account",
        items: [{ href: "/dashboard/upgrade", icon: Gem, text: "Upgrade"},],
    },

     {
        category: "Settings",
        items: [
            { href: "/dashboard/api-key", icon: Key, text: "API Key" },
            { href: "/dashboard/accounting-settings", icon: Settings, text: "Accounting Settings" },
        ],
    },
]

export const Sidebar = ({onClose}: { onClose?: () => void}) => {
    return (
        <div className="space-y-4 md:space-y-6 relative z-20 flex flex-col h-full ">
        
            {/* Logo */}
            <p className="hidden sm:block  text-lg/7 font-semibold text-brand-900">
                Ping <span className="text-brand-700">Panda</span>
            </p>

            {/* Navigation Items */}
            <div className="flex-grow">
                <ul>
                    {SidebarItems.map(({ category, items }) => (
                    <li key={category} className="mb-4 md:mb-8">
                        <p className="text-xs font-medium leading-6 text-zinc-500">
                        {category}
                        </p>

                        <div className="-mx-2 flex flex-1 flex-col">
                        {items.map((item, i) => (
                            <Link
                            to={item.href}
                            key={i}
                            className={cn(
                                buttonVariants({ variant: "ghost", size: "sm" }),
                                "w-full justify-start group flex items-center gap-x-2.5 rounded-md px-2 py-1.5 text-sm font-medium leading-6 text-zinc-700 hover:bg-gray-100 transition"
                            )}
                            onClick={onClose}
                            >
                            <item.icon className="size-4 text-zinc-500 group-hover:text-zinc-700" />
                            {item.text}
                            </Link>
                        ))}
                        </div>
                    </li>
                    ))}
                </ul>
            </div>

            <div className="flex flex-col">
                <hr className="my-4 md:my-6 w-full h-px bg-gray-100"/>

                <UserButton
                    showName
                    appearance={{
                        elements: {userButtonBox: "flex-row-reverse"},
                    }}
                />
            </div>
        </div>
    )
}