import express  from "express";
import { syncClerk } from "@/controllers/internal/authControllers";
import { requireAuth } from "@clerk/express";


export const authRouter = express.Router();

authRouter.get('/sync', requireAuth(), syncClerk)

export default authRouter
