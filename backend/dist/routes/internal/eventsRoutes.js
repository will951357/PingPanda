"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const eventsControllers_1 = require("@/controllers/internal/eventsControllers");
const express_2 = require("@clerk/express");
const attachMiddlewere_1 = require("@/middleware/attachMiddlewere");
const eventsRouter = express_1.default.Router();
eventsRouter.get('/', (0, express_2.requireAuth)(), attachMiddlewere_1.attachUser, eventsControllers_1.getEventsByCategoryName);
exports.default = eventsRouter;
