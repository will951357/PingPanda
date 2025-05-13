"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventRouter = void 0;
const express_1 = __importDefault(require("express"));
const eventsController_1 = require("@/controllers/public/eventsController");
exports.eventRouter = express_1.default.Router();
exports.eventRouter.post('/events', eventsController_1.createEvent);
exports.default = exports.eventRouter;
