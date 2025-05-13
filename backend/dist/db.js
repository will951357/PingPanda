"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
// src/db.ts
const client_1 = require("@prisma/client");
exports.db = new client_1.PrismaClient();
