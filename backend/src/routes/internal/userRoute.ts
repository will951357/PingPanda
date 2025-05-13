import express  from "express";
import { getSingleUser, getQuota, updateDiscordId } from "@/controllers/internal/userControllers";
import { requireAuth } from "@clerk/express";
import { attachUser } from "@/middleware/attachMiddlewere";


const userRouter = express.Router();


// // fluxo
// 1. Clerk verifica se o token é válido  → (requireAuth)
// 2. Middleware busca o user no banco    → (attachUser)
// 3. Controller usa os dados e responde  → (getSingleUser)
userRouter.get('/', requireAuth(), attachUser,  getSingleUser)
userRouter.get('/quota', requireAuth(), attachUser, getQuota)
userRouter.put('/discord', requireAuth(), attachUser, updateDiscordId)

export default userRouter
