"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoute_1 = __importDefault(require("./routes/internal/authRoute"));
const userRoute_1 = __importDefault(require("./routes/internal/userRoute"));
const categoriesRoute_1 = __importDefault(require("./routes/internal/categoriesRoute"));
const eventsRoutes_1 = __importDefault(require("./routes/public/v1/eventsRoutes"));
const eventsRoutes_2 = __importDefault(require("./routes/internal/eventsRoutes"));
const paymentRoute_1 = __importDefault(require("./routes/internal/paymentRoute"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/auth', authRoute_1.default);
app.use('/user', userRoute_1.default);
app.use('/category', categoriesRoute_1.default);
app.use('/events', eventsRoutes_2.default);
app.use('/payment', paymentRoute_1.default);
// acesso publico
app.use('/api/v1', eventsRoutes_1.default);
exports.default = app;
