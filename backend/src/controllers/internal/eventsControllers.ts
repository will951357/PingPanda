import { db } from "@/db";
import { startOfDay, startOfMonth, startOfWeek } from "date-fns";
import { create } from "domain";
import { Request, Response } from "express";
import superjson from "superjson";

export const getEventsByCategoryName = async (req: Request, res: Response) => {
    const user = (req as any).userDb;
    const categoryName = req.query.categoryName as string;
    const timeRange = req.query.timeRange as "today" | "week" | "month";
    const page = parseInt(req.query.page as string, 10);
    const limit = parseInt(req.query.limit as string, 10);

    if (!categoryName || !timeRange || isNaN(page) || isNaN(limit)) {
        res.status(400).json({ error: "Parâmetros inválidos" });
        return;
    }

    const now = new Date();

    let startDate: Date = new Date();

    switch(timeRange) {
        case "today":
            startDate = startOfDay(now);
            break;
        case "week":
            startDate = startOfWeek(now, { weekStartsOn: 0 });
            break;
        case "month":
            startDate = startOfMonth(now);
            break;
    }

    const [events, eventsCount, uniqueFieldsCount] = await Promise.all([
        db.event.findMany({
            where: {
                eventCategory: {name: categoryName, userId: user.id} ,
                createdAt: {gte: startDate},
            },
            skip: ( page - 1) * limit,
            take: limit,
            orderBy: { createdAt: "desc" },
        }),

        db.event.count({
             where: {
                eventCategory: {name: categoryName, userId: user.id} ,
                createdAt: {gte: startDate},
            },
        }),

        db.event.findMany({
            where: {
                eventCategory: {name: categoryName, userId: user.id} ,
                createdAt: {gte: startDate},
            },
            select: {
                fields: true,
            },
            distinct: ["fields"],
        }).then((events) => {
        const fieldsNames = new Set<string>();
        (events as Array<{ fields: Record<string, any> }>).forEach((event) => {
            Object.keys(event.fields).forEach((fieldName) => {
                fieldsNames.add(fieldName);
            });
        });
        return fieldsNames.size;
    })
    ]);

    const data ={
        events,
        eventsCount,
        uniqueFieldsCount,
    };

    res.status(200).json(superjson.serialize(data))
};