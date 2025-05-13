import { db } from '@/db';
import { Request, Response } from 'express';
import {z} from 'zod';
import { FREE_QUOTA, PRO_QUOTA } from '@/config';
import { DiscordClient } from '@/lib/discordClient';
import { title } from 'process';
import { time } from 'console';

export const CATEGORY_NAME_VALIDATOR = z.string().min(1, "Category name is required").max(50, "Category name must be less than 50 characters").regex(/^[a-zA-Z0-9-]*$/, "Category name can only contain letters, numbers, and hyphens");

const REQUEST_SCHEMA = z
    .object({
        category: CATEGORY_NAME_VALIDATOR,
        fields: z.record(z.string().or(z.number()).or(z.boolean())).optional(),
        description: z.string().optional(),
    })
    .strict();

export const createEvent = async (req: Request, res: Response) => {
    try{
        const authHeader = req.headers.authorization;

        console.log('authHeader', authHeader)

        if (!authHeader) {
            res.status(401).json({ error: 'Unauthorized' });
            return
        }

        if (!authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Invalid token format. Expected Bearer [API_KEY]' });
            return;
        }

        const apiKey = authHeader.split(' ')[1];

        if (!apiKey || apiKey.trim() === '') {
            res.status(401).json({ error: 'Unauthorized' });
            return
        }

        const user =  await db.user.findUnique({
            where: { apiKey },
            include: {
                EventCategories: true
            }
        })

        if (!user) {
            res.status(401).json({ error: 'Unauthorized' });
            return
        }

        if (!user.discordId) {
            res.status(403).json({ error: 'Please enter your DiscordId in your account settings' });
            return
        }

        // Logic
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // Months are zero-based in JavaScript
        const currentYear = currentDate.getFullYear();
        
        const quota = await db.quota.findUnique({
            where: {
                userId: user.id,
                month: currentMonth,
                year: currentYear,
            },
        });

        const quataLimit = user.plan === 'PRO' ? PRO_QUOTA.MaxEventsPerMonth : FREE_QUOTA.MaxEventsPerMonth;
        
        if (quota && quota.count >= quataLimit) {
            res.status(429).json({ error: `Quota exceeded. You can only create ${quataLimit} events per month. Upgrade your plan for more events` });
            return;
        }

        // Discord Client
        const discord = new DiscordClient(process.env.DISCORD_BOT_TOKEN);
        const dmChannel = await discord.createDM(user.discordId);

        let requestData: unknown

        try {
            requestData = await req.body;
        } catch (err) {
            res.status(400).json({ error: 'Invalid request body' });
            return
        }

        const validationResult = REQUEST_SCHEMA.parse(requestData);

        const category = user.EventCategories.find((cat) => cat.name === validationResult.category);

        if (!category) {
            res.status(404).json({ error: `You dont have a category named "${validationResult.category}"` });
            return;
        }


        // Dados do evento
        const eventData = {
            title: `${category.emoji || "🔔"}  ${
                category.name.charAt(0).toUpperCase() + category.name.slice(1)
            }`,
            description: validationResult.description || `A new ${category.name} event has occurred!`,
            color: category.color,
            timestamp: new Date().toISOString(),
            fields: Object.entries(validationResult.fields || {}).map(([key, value]) => {
                return {
                    name: key,
                    value: String(value),
                    inline: true,
                }
            })   
        }

        const event = await db.event.create({
            data: {
                name: category.name,
                formatedMessage: `${eventData.title}\n\n${eventData.description}`,
                userId: user.id,
                eventCategoryId: category.id,
                fields: validationResult.fields || {},
            }
        })
        
        try {
            await discord.sendEmbed(dmChannel.id, eventData);

            await db.event.update({
                where: {id: event.id},
                data: {deliveryStatus: 'DELIVERED'}
            })

            await db.quota.upsert({
                where: { userId: user.id, month: currentMonth, year: currentYear },
                update: { count: { increment: 1 } },
                create: {
                    userId: user.id,
                    month: currentMonth,
                    year: currentYear,
                    count: 1,
                    updatedAt: new Date(),
                },
            })
        } catch (err) {
            await db.event.update({
                where: { id: event.id },
                data: { deliveryStatus: "FAILED" },
            })

            console.log('Error sending message to Discord:', err);

            res.status(500).json({ error: 'Failed to send message to Discord', eventId: event.id });
            return;
        }

        res.status(200).json({ message: 'Event created successfully', eventId: event.id });
    } catch (error) {
        console.error('Error creating event:', error);
        if (error instanceof z.ZodError) {
            res.status(422).json({ error: error.errors });
            return;
        }
        res.status(500).json({ error: 'Internal server error' });
    }

}