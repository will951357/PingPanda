"use client";

import { useState, type PropsWithChildren } from "react";
import {useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/modal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth,  } from "@clerk/clerk-react";
import { useCategoryContext } from "@/context/CategoryContext";
import { EVENT_CATEGORY_VALIDATION, type EventCategoryForm } from "@/types/types";


const COLOR_OPTIONS = [
"#FF6B6B", // bg-[#FF6B6B] ring-[#FF6B6B] Bright Red
"#4ECDC4", // bg-[#4ECDC4] ring-[#4ECDC4] Teal
"#45B7D1", // bg-[#45B7D1] ring-[#45B7D1] Sky Blue
"#FFA07A", // bg-[#FFA07A] ring-[#FFA07A] Light Salmon
"#98D8C8", // bg-[#98D8C8] ring-[#98D8C8] Seafoam Green
"#FDCB6E", // bg-[#FDCB6E] ring-[#FDCB6E] Mustard Yellow
"#6C5CE7", // bg-[#6C5CE7] ring-[#6C5CE7] Soft Purple
"#FF85A2", // bg-[#FF85A2] ring-[#FF85A2] Pink
"#2ECC71", // bg-[#2ECC71] ring-[#2ECC71] Emerald Green
"#E17055", // bg-[#E17055] ring-[#E17055] Terracotta]
]

const EMOJI_OPTIONS = [
{ emoji: "💰", label: "Money (Sale)" },
{ emoji: "👤", label: "User (Sign-up)" },
{ emoji: "🎉", label: "Celebration" },
{ emoji: "📅", label: "Calendar" },
{ emoji: "🚀", label: "Launch" },
{ emoji: "📢", label: "Announcement" },
{ emoji: "🎓", label: "Graduation" },
{ emoji: "🏆", label: "Achievement" },
{ emoji: "💡", label: "Idea" },
{ emoji: "🔔", label: "Notification" },
]

export const CreateEventsCategoryModal = ({ children }: PropsWithChildren) => {
    const [isOpen, setIsOpen] = useState(false);
    const {getToken} = useAuth();
    const { createNewCategory } = useCategoryContext();
    
    const {register, handleSubmit, formState: {errors}, watch, setValue} = useForm<EventCategoryForm>({
        resolver: zodResolver(EVENT_CATEGORY_VALIDATION)
    })

    const color = watch("color")
    const selectedEmoji = watch("emoji")


    const onSubmit = async (data: EventCategoryForm) => {
        try {
            await createNewCategory(data)
            setIsOpen(false)
        } catch (error) {
            console.error("Error creating category", error)
        }
    }

    return (
        <>
            <div onClick={() => setIsOpen(true)}>{children}</div>

            <Modal className="max-w-xl p-8" showModal={isOpen} setShowModal={setIsOpen}> 
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div >
                        <h2 className="text-lg/7 font-medium tracking-tight text-gray-950">
                            New Event Category
                        </h2>

                        <p className="text-sm/6 text-gray-600" >
                            Create a new category for your events. This will help you organize and manage your events more effectively.
                        </p>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-5">
                        <div>
                            <Label htmlFor="name">
                                Category Name
                            </Label>

                            <Input autoFocus id="name" placeholder="Category Name" {...register("name")} className="w-full"/>

                            {errors.name ? <p className="mt-1 text-sm text-red-500">
                                {errors.name.message}
                            </p>: null}
                        </div>
                        
                        {/* Color */} 
                        <div className="">
                            <Label>Color</Label>
                            <div className="flex flex-wrap gap-3">
                                {COLOR_OPTIONS.map((preColor) => (
                                    <Button
                                        key={preColor}
                                        type="button"
                                        className={cn(`bg-[${preColor}]`, "size-10 rounded-full ring-2 ring-offset-2 transition-all", color === preColor ? "ring-brand-700 scale-110" : "ring-transparent hover:scale-110")}
                                        onClick={()=> setValue("color", preColor)}
                                    >
                                        {/* Add content or leave empty */}
                                    </Button>
                                ))}
                            </div>

                            {errors.color ? <p className="mt-1 text-sm text-red-500">
                                {errors.color.message}
                                </p>
                            : null}
                        </div>

                        {/* Emoji */}
                        <div className="">
                            <Label>Emoji</Label>
                            <div className="flex flex-wrap gap-3">
                                {EMOJI_OPTIONS.map(({emoji, label}) => (
                                    <Button
                                        key={emoji}
                                        type="button"
                                        className={cn("size-10 flex items-center justify-center text-xl rounded-md transition-all", selectedEmoji === emoji ?"bg-brand-100 ring-2 ring-brand-700 scale-110": "bg-brand-100 hover:bg-brand-200")}
                                        onClick={()=> setValue("emoji", emoji)}
                                    >
                                        {emoji}      
                                    </Button>
                                ))}
                            </div>

                            {errors.emoji ? <p className="mt-1 text-sm text-red-500">
                                {errors.emoji.message}
                                </p>
                            : null}
                        </div>
                    </div>

                    <div className=" flex justify-end space-3 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            Create Category
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    )

}