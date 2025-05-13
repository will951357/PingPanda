import express from 'express';
import { getCategories, getAllCategories, deleteCategory, createCategory, quickStartCategories, categoryInfo } from '@/controllers/internal/categoryControllers';
import { requireAuth } from '@clerk/express';
import { attachUser } from '@/middleware/attachMiddlewere';

const catRouter = express.Router();

catRouter.get("/", requireAuth(), attachUser, getCategories)
catRouter.get("/all",  getAllCategories)
catRouter.delete("/:name", requireAuth(), attachUser, deleteCategory)
catRouter.post("/", requireAuth(), attachUser, createCategory)
catRouter.post("/start", requireAuth(), attachUser, quickStartCategories)
catRouter.get("/info/:name", requireAuth(), attachUser, categoryInfo)


export default catRouter