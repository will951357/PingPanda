import { NextFunction, Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { db } from "@/db";

export const attachUser = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = getAuth(req);

    console.log('userID', userId)

    if (!userId) {
        res.status(401).json({ error: "Usuário não autenticado" });
        return;
    }

    try {

        const user = await db.user.findUnique({
            where: {
                externalId: userId
            }
        })

        if (!user) {
            res.status(404).json({ error: "Usuário não encontrado no banco" });
            return
        }

         // Anexar o user no req
        (req as any).userDb = user;

        next();

    } catch (error) {
        console.error("Erro ao buscar usuário no banco:", error);
        res.status(500).json({ error:"Erro interno ao buscar usuário" });
    }

}