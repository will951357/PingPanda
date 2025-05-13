import { db } from "@/db";
import { Request, Response } from "express"
import {startOfMonth} from "date-fns"
import superjson from "superjson"
import { parseColor } from "@/lib/utils";

export const getCategories =  async (req: Request, res: Response) => {

    const user = (req as any).userDb;
    
    try {

        // Primeira requisição busca as categorias
        const categories = await db.eventCategory.findMany({
            where:{userId: user.id},
            select: {
                id:true,
                name: true,
                emoji: true,
                color:true,
                updatedAt: true,
                createdAt: true,
            },
            orderBy: {updatedAt: "desc"}
        })

        const categoriesWithCount = Promise.all(categories.map(async (category) => {
            const now = new Date()
            const firstDayOfMonth = startOfMonth(now)

            const [uniqueFieldCount, eventsCount, lastPing] = await Promise.all(
                [
                    db.event
                        // Busca todos eventos criado pela catoria no mes
                        .findMany({
                            where: {eventCategory: {id: category.id}, createdAt: {gte: firstDayOfMonth},},
                            select: {fields: true},
                            distinct: ['fields'],
                        })
                        // O 'then' serve para processar dados retornados da promessa do Prisma antes de continuar o Promisse.all
                        .then((events) => {
                            const fieldNames = new Set<String>() //Garante a unicidade dos nomes
                            events.forEach((event) => {
                                Object.keys(event.fields as object).forEach(
                                    (fieldName) => {
                                        fieldNames.add(fieldName)
                                    }
                                )
                            })

                            return fieldNames.size
                        }),
                    
                    // Busca todos eventos criado no mes
                    db.event.count(
                        {
                            where: {
                                eventCategory: {id: category.id},
                                createdAt: {gte: firstDayOfMonth},
                            },

                        }
                    ),

                    // Busca data do ultimo evento
                    db.event.findFirst({
                        where: {eventCategory: {id: category.id}},
                        orderBy: {createdAt: 'desc'},
                        select: {createdAt: true},
                    })
                ]
            )

            return {
                ...category,
                uniqueFieldCount,
                eventsCount,
                lastPing: lastPing?.createdAt || null
            }
        }))
        
        const data = superjson.stringify({
            categories: await categoriesWithCount,
          });

        res.status(200).send(data)
    } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }

}

export const getAllCategories = async (req: Request, res: Response) => {
    console.log('Todas categorias')

    const categories = await db.eventCategory.findMany({
        select: {
            id:true,
            name: true,
            emoji: true,
            color:true,
            updatedAt: true,
            createdAt: true,
        },
        orderBy: {updatedAt: "desc"}
    })

    const data = superjson.stringify({
        categories: await categories,
      });

    res.status(200).send(data)

}


export const deleteCategory = async (req: Request, res:Response) => {
    const user = (req as any).userDb;
    const { name } = req.params

    try {

        const deleted = await db.eventCategory.delete({
            where: {
                name_userId: {
                  name,
                  userId: user.id
                }
              }
        })

        res.status(200).json(deleted)
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Erro ao deletar categoria"})
    }
}

export const createCategory = async (req: Request, res: Response) => {
    const user = (req as any).userDb;
    const { name, color, emoji } = req.body

    try {
        const category = await db.eventCategory.create({
            data: {
                name: name.toLowerCase(),
                color: parseColor(color),
                emoji,
                userId: user.id
            }
        })

        res.status(200).json(category)
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Erro ao criar categoria"})
    }
}


export const quickStartCategories = async (req: Request, res: Response) => {
    const user = (req as any).userDb;

    try {
        const categories = await db.eventCategory.findMany({
            where:{userId: user.id},
            select: {
                id:true,
                name: true,
                emoji: true,
                color:true,
                updatedAt: true,
                createdAt: true,
            },
            orderBy: {updatedAt: "desc"}
        })

        if (categories.length > 0) {
            res.status(200).json(categories);
            return
        }

        const quickStartCategories = [
            { name: "vendas", color: 0xff6b6, emoji: "💰" },
            { name: "marketing", color: 0xffeb3b, emoji: "📈" },
            { name: "suporte", color: 0x6c5ce7, emoji: "💬" },
        ]

        const createdCategories = await Promise.all(
            quickStartCategories.map((category) =>
                db.eventCategory.create({
                    data: {
                        ...category,
                        userId: user.id
                    }
                })
            )
        )

        res.status(200).json(createdCategories)
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Erro ao criar categorias"})
    }
}


export const categoryInfo = async (req: Request, res: Response) => {
    const user = (req as any).userDb;
    const { name } = req.params

    try {
        const category = await db.eventCategory.findUnique({
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
        })

        res.status(200).json(category)
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Erro ao buscar categoria"})
    }
}