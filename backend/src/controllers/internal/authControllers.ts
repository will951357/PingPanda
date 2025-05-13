import { Request, Response } from "express"
import { db } from "@/db"
import { getAuth } from "@clerk/express"

export const syncClerk=  async (req: Request, res: Response) => {

    const {userId} = getAuth(req);

    if (!userId) {
        res.json({isSynced: false});
        return;
    }

    try {
        let user = await db.user.findFirst({
            where: {externalId: userId}
        })

        if (!user) {
            const email = req.auth?.session?.user?.emailAddresses?.[0]?.emailAddress || 'unknow'

            await db.user.create({
                data: {
                    quotaLimit: 100,
                    email, 
                    externalId: userId
                }
            })
        }

        res.status(200).json({isSynced: true})

    } catch (error) {
        console.error(error)
        res.status(500).json({isSynced:false})
    }
    
}