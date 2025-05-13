"use client";

import { useState } from "react"
import { updateDiscordId } from "@/lib/api";
import { useAuth } from "@clerk/clerk-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const AccountSettingsContent = ({
    discordId: initialDiscordId,
}: {
    discordId: string
}) => {
    const [discordId, setDiscordId] = useState(initialDiscordId)
    const [isPending, setIsPending] = useState(false)
    const {getToken} = useAuth();

    const updDiscoId = async (discordId: string) => {
        setIsPending(true)
        const token = await getToken();
        const resp = await updateDiscordId(token!, discordId)

        setIsPending(false)
        console.log(resp)
        return resp;
    }

    return (
        <Card className="max-w-xl w-full space-y-4">
            <div className="">
                <Label>
                    Discord Id
                </Label>
                <Input className="mt-1" value={discordId} onChange={(e) => setDiscordId(e.target.value)}
                placeholder="Enter your discord ID" /> 
            </div>

            <p className="mt-2 text-sm/6 text-gray-600 ">
            Don't kwnow how to find your discord ID? {" "}
            <Link to="#" className="text-brand-600 hover:text-brand-500 "> Learn how to obtain it here</Link> 
            </p>

            <div className="pt-4">
                <Button onClick={() => updDiscoId(discordId)} disabled={isPending}> 
                    {isPending ? "Saving...": "Save changes"}
                </Button>
            </div>
        </Card>
    )

    
}