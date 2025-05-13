"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const categoryControllers_1 = require("@/controllers/internal/categoryControllers");
const express_2 = require("@clerk/express");
const attachMiddlewere_1 = require("@/middleware/attachMiddlewere");
const catRouter = express_1.default.Router();
catRouter.get("/", (0, express_2.requireAuth)(), attachMiddlewere_1.attachUser, categoryControllers_1.getCategories);
catRouter.get("/all", categoryControllers_1.getAllCategories);
catRouter.delete("/:name", (0, express_2.requireAuth)(), attachMiddlewere_1.attachUser, categoryControllers_1.deleteCategory);
catRouter.post("/", (0, express_2.requireAuth)(), attachMiddlewere_1.attachUser, categoryControllers_1.createCategory);
catRouter.post("/start", (0, express_2.requireAuth)(), attachMiddlewere_1.attachUser, categoryControllers_1.quickStartCategories);
catRouter.get("/info/:name", (0, express_2.requireAuth)(), attachMiddlewere_1.attachUser, categoryControllers_1.categoryInfo);
exports.default = catRouter;
