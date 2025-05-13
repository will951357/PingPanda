"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachUser = void 0;
const express_1 = require("@clerk/express");
const db_1 = require("@/db");
const attachUser = async (req, res, next) => {
    const { userId } = (0, express_1.getAuth)(req);
    console.log('userID', userId);
    if (!userId) {
        res.status(401).json({ error: "Usuário não autenticado" });
        return;
    }
    try {
        const user = await db_1.db.user.findUnique({
            where: {
                externalId: userId
            }
        });
        if (!user) {
            res.status(404).json({ error: "Usuário não encontrado no banco" });
            return;
        }
        // Anexar o user no req
        req.userDb = user;
        next();
    }
    catch (error) {
        console.error("Erro ao buscar usuário no banco:", error);
        res.status(500).json({ error: "Erro interno ao buscar usuário" });
    }
};
exports.attachUser = attachUser;
