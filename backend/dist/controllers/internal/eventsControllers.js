"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventsByCategoryName = void 0;
const db_1 = require("@/db");
const date_fns_1 = require("date-fns");
const superjson_1 = __importDefault(require("superjson"));
const getEventsByCategoryName = async (req, res) => {
    const user = req.userDb;
    const categoryName = req.query.categoryName;
    const timeRange = req.query.timeRange;
    const page = parseInt(req.query.page, 10);
    const limit = parseInt(req.query.limit, 10);
    if (!categoryName || !timeRange || isNaN(page) || isNaN(limit)) {
        res.status(400).json({ error: "Parâmetros inválidos" });
        return;
    }
    const now = new Date();
    let startDate = new Date();
    switch (timeRange) {
        case "today":
            startDate = (0, date_fns_1.startOfDay)(now);
            break;
        case "week":
            startDate = (0, date_fns_1.startOfWeek)(now, { weekStartsOn: 0 });
            break;
        case "month":
            startDate = (0, date_fns_1.startOfMonth)(now);
            break;
    }
    const [events, eventsCount, uniqueFieldsCount] = await Promise.all([
        db_1.db.event.findMany({
            where: {
                eventCategory: { name: categoryName, userId: user.id },
                createdAt: { gte: startDate },
            },
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: "desc" },
        }),
        db_1.db.event.count({
            where: {
                eventCategory: { name: categoryName, userId: user.id },
                createdAt: { gte: startDate },
            },
        }),
        db_1.db.event.findMany({
            where: {
                eventCategory: { name: categoryName, userId: user.id },
                createdAt: { gte: startDate },
            },
            select: {
                fields: true,
            },
            distinct: ["fields"],
        }).then((events) => {
            const fieldsNames = new Set();
            events.forEach((event) => {
                Object.keys(event.fields).forEach((fieldName) => {
                    fieldsNames.add(fieldName);
                });
            });
            return fieldsNames.size;
        })
    ]);
    const data = {
        events,
        eventsCount,
        uniqueFieldsCount,
    };
    res.status(200).json(superjson_1.default.serialize(data));
};
exports.getEventsByCategoryName = getEventsByCategoryName;
