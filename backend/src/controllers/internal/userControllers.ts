import { FREE_QUOTA, PRO_QUOTA } from "@/config";
import { db } from "@/db";
import { addMonths, startOfMonth } from "date-fns";
import { Request, Response } from "express"
import superjson from "superjson";


export const getSingleUser =  async (req: Request, res: Response) => {

    const user = (req as any).userDb;
    
    try {
        res.status(200).json({ user });
    
    } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }


}


export const getQuota = async (req: Request, res: Response) => {
    const user = (req as any).userDb;

    const currentDate = startOfMonth(new Date())

    const quota = await db.quota.findFirst({
        where: {
            userId: user.id,
            year: currentDate.getFullYear(),
            month: currentDate.getMonth() + 1,
        }
    });

    const eventsCount = quota?.count ?? 0;

    const categoriesCount = await db.eventCategory.count({
        where: {userId: user.id}
    })

    const limits = user.plan === "PRO" ? PRO_QUOTA: FREE_QUOTA

    const resetDate = addMonths(currentDate, 1)


    const data ={
        categoriesUsed: categoriesCount,
        categoriesLimit: limits.MaxCategories,
        eventsUsed: eventsCount,
        eventsLimit: limits.MaxEventsPerMonth,
        resetDate
    };

    res.status(200).json(superjson.serialize(data))

}

export const updateDiscordId = async (req: Request, res: Response) => {
    const user = (req as any).userDb;
    const {discordId} = req.body;

    try {

        const updated = await db.user.update({
            where: {id: user.id},
            data: {discordId},
        })

        res.status(200).json({updated})

    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal server error"})
    }
}