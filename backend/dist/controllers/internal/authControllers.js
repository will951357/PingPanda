"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncClerk = void 0;
const db_1 = require("@/db");
const express_1 = require("@clerk/express");
const syncClerk = async (req, res) => {
    const { userId } = (0, express_1.getAuth)(req);
    if (!userId) {
        res.json({ isSynced: false });
        return;
    }
    try {
        let user = await db_1.db.user.findFirst({
            where: { externalId: userId }
        });
        if (!user) {
            const email = req.auth?.session?.user?.emailAddresses?.[0]?.emailAddress || 'unknow';
            await db_1.db.user.create({
                data: {
                    quotaLimit: 100,
                    email,
                    externalId: userId
                }
            });
        }
        res.status(200).json({ isSynced: true });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ isSynced: false });
    }
};
exports.syncClerk = syncClerk;
