"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paymentControllers_1 = require("@/controllers/internal/paymentControllers");
const express_2 = require("@clerk/express");
const attachMiddlewere_1 = require("@/middleware/attachMiddlewere");
const payRouter = express_1.default.Router();
payRouter.post("/create-checkout-session", (0, express_2.requireAuth)(), attachMiddlewere_1.attachUser, paymentControllers_1.paymentRoute);
exports.default = payRouter;
