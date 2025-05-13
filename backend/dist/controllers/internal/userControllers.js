"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDiscordId = exports.getQuota = exports.getSingleUser = void 0;
const config_1 = require("@/config");
const db_1 = require("@/db");
const date_fns_1 = require("date-fns");
const superjson_1 = __importDefault(require("superjson"));
const getSingleUser = async (req, res) => {
    const user = req.userDb;
    try {
        res.status(200).json({ user });
    }
    catch (error) {
        console.error("Erro ao buscar usuário:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};
exports.getSingleUser = getSingleUser;
const getQuota = async (req, res) => {
    const user = req.userDb;
    const currentDate = (0, date_fns_1.startOfMonth)(new Date());
    const quota = await db_1.db.quota.findFirst({
        where: {
            userId: user.id,
            year: currentDate.getFullYear(),
            month: currentDate.getMonth() + 1,
        }
    });
    const eventsCount = quota?.count ?? 0;
    const categoriesCount = await db_1.db.eventCategory.count({
        where: { userId: user.id }
    });
    const limits = user.plan === "PRO" ? config_1.PRO_QUOTA : config_1.FREE_QUOTA;
    const resetDate = (0, date_fns_1.addMonths)(currentDate, 1);
    const data = {
        categoriesUsed: categoriesCount,
        categoriesLimit: limits.MaxCategories,
        eventsUsed: eventsCount,
        eventsLimit: limits.MaxEventsPerMonth,
        resetDate
    };
    res.status(200).json(superjson_1.default.serialize(data));
};
exports.getQuota = getQuota;
const updateDiscordId = async (req, res) => {
    const user = req.userDb;
    const { discordId } = req.body;
    try {
        const updated = await db_1.db.user.update({
            where: { id: user.id },
            data: { discordId },
        });
        res.status(200).json({ updated });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.updateDiscordId = updateDiscordId;
