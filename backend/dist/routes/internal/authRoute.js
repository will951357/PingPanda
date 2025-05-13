"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const authControllers_1 = require("@/controllers/internal/authControllers");
const express_2 = require("@clerk/express");
exports.authRouter = express_1.default.Router();
exports.authRouter.get('/sync', (0, express_2.requireAuth)(), authControllers_1.syncClerk);
exports.default = exports.authRouter;
