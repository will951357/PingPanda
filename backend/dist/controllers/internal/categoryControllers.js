"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryInfo = exports.quickStartCategories = exports.createCategory = exports.deleteCategory = exports.getAllCategories = exports.getCategories = void 0;
const db_1 = require("@/db");
const date_fns_1 = require("date-fns");
const superjson_1 = __importDefault(require("superjson"));
const utils_1 = require("@/lib/utils");
const getCategories = async (req, res) => {
    const user = req.userDb;
    try {
        // Primeira requisição busca as categorias
        const categories = await db_1.db.eventCategory.findMany({
            where: { userId: user.id },
            select: {
                id: true,
                name: true,
                emoji: true,
                color: true,
                updatedAt: true,
                createdAt: true,
            },
            orderBy: { updatedAt: "desc" }
        });
        const categoriesWithCount = Promise.all(categories.map(async (category) => {
            const now = new Date();
            const firstDayOfMonth = (0, date_fns_1.startOfMonth)(now);
            const [uniqueFieldCount, eventsCount, lastPing] = await Promise.all([
                db_1.db.event
                    // Busca todos eventos criado pela catoria no mes
                    .findMany({
                    where: { eventCategory: { id: category.id }, createdAt: { gte: firstDayOfMonth }, },
                    select: { fields: true },
                    distinct: ['fields'],
                })
                    // O 'then' serve para processar dados retornados da promessa do Prisma antes de continuar o Promisse.all
                    .then((events) => {
                    const fieldNames = new Set(); //Garante a unicidade dos nomes
                    events.forEach((event) => {
                        Object.keys(event.fields).forEach((fieldName) => {
                            fieldNames.add(fieldName);
                        });
                    });
                    return fieldNames.size;
                }),
                // Busca todos eventos criado no mes
                db_1.db.event.count({
                    where: {
                        eventCategory: { id: category.id },
                        createdAt: { gte: firstDayOfMonth },
                    },
                }),
                // Busca data do ultimo evento
                db_1.db.event.findFirst({
                    where: { eventCategory: { id: category.id } },
                    orderBy: { createdAt: 'desc' },
                    select: { createdAt: true },
                })
            ]);
            return {
                ...category,
                uniqueFieldCount,
                eventsCount,
                lastPing: lastPing?.createdAt || null
            };
        }));
        const data = superjson_1.default.stringify({
            categories: await categoriesWithCount,
        });
        res.status(200).send(data);
    }
    catch (error) {
        console.error("Erro ao buscar usuário:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};
exports.getCategories = getCategories;
const getAllCategories = async (req, res) => {
    console.log('Todas categorias');
    const categories = await db_1.db.eventCategory.findMany({
        select: {
            id: true,
            name: true,
            emoji: true,
            color: true,
            updatedAt: true,
            createdAt: true,
        },
        orderBy: { updatedAt: "desc" }
    });
    const data = superjson_1.default.stringify({
        categories: await categories,
    });
    res.status(200).send(data);
};
exports.getAllCategories = getAllCategories;
const deleteCategory = async (req, res) => {
    const user = req.userDb;
    const { name } = req.params;
    try {
        const deleted = await db_1.db.eventCategory.delete({
            where: {
                name_userId: {
                    name,
                    userId: user.id
                }
            }
        });
        res.status(200).json(deleted);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Erro ao deletar categoria" });
    }
};
exports.deleteCategory = deleteCategory;
const createCategory = async (req, res) => {
    const user = req.userDb;
    const { name, color, emoji } = req.body;
    try {
        const category = await db_1.db.eventCategory.create({
            data: {
                name: name.toLowerCase(),
                color: (0, utils_1.parseColor)(color),
                emoji,
                userId: user.id
            }
        });
        res.status(200).json(category);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Erro ao criar categoria" });
    }
};
exports.createCategory = createCategory;
const quickStartCategories = async (req, res) => {
    const user = req.userDb;
    try {
        const categories = await db_1.db.eventCategory.findMany({
            where: { userId: user.id },
            select: {
                id: true,
                name: true,
                emoji: true,
                color: true,
                updatedAt: true,
                createdAt: true,
            },
            orderBy: { updatedAt: "desc" }
        });
        if (categories.length > 0) {
            res.status(200).json(categories);
            return;
        }
        const quickStartCategories = [
            { name: "vendas", color: 0xff6b6, emoji: "💰" },
            { name: "marketing", color: 0xffeb3b, emoji: "📈" },
            { name: "suporte", color: 0x6c5ce7, emoji: "💬" },
        ];
        const createdCategories = await Promise.all(quickStartCategories.map((category) => db_1.db.eventCategory.create({
            data: {
                ...category,
                userId: user.id
            }
        })));
        res.status(200).json(createdCategories);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Erro ao criar categorias" });
    }
};
exports.quickStartCategories = quickStartCategories;
const categoryInfo = async (req, res) => {
    const user = req.userDb;
    const { name } = req.params;
    try {
        const category = await db_1.db.eventCategory.findUnique({
            where: {
                name_userId: {
                    name,
                    userId: user.id
                }
            },
            include: {
                _count: {
                    select: {
                        events: true,
                    }
                }
            }
        });
        res.status(200).json(category);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Erro ao buscar categoria" });
    }
};
exports.categoryInfo = categoryInfo;
