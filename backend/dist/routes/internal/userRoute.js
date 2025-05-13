"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userControllers_1 = require("@/controllers/internal/userControllers");
const express_2 = require("@clerk/express");
const attachMiddlewere_1 = require("@/middleware/attachMiddlewere");
const userRouter = express_1.default.Router();
// // fluxo
// 1. Clerk verifica se o token é válido  → (requireAuth)
// 2. Middleware busca o user no banco    → (attachUser)
// 3. Controller usa os dados e responde  → (getSingleUser)
userRouter.get('/', (0, express_2.requireAuth)(), attachMiddlewere_1.attachUser, userControllers_1.getSingleUser);
userRouter.get('/quota', (0, express_2.requireAuth)(), attachMiddlewere_1.attachUser, userControllers_1.getQuota);
userRouter.put('/discord', (0, express_2.requireAuth)(), attachMiddlewere_1.attachUser, userControllers_1.updateDiscordId);
exports.default = userRouter;
