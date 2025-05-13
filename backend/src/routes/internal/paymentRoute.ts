import expres from "express"
import { paymentRoute } from "@/controllers/internal/paymentControllers"
import { requireAuth } from '@clerk/express';
import { attachUser } from '@/middleware/attachMiddlewere';

const payRouter = expres.Router()

payRouter.post("/create-checkout-session", requireAuth(), attachUser, paymentRoute)

export default payRouter