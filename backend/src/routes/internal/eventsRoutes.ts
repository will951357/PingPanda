import express from 'express';
import { getEventsByCategoryName } from '@/controllers/internal/eventsControllers';
import { requireAuth } from '@clerk/express';
import { attachUser } from '@/middleware/attachMiddlewere';

const eventsRouter = express.Router();

eventsRouter.get('/', requireAuth(), attachUser, getEventsByCategoryName);

export default eventsRouter;