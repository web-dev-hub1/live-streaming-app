"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaClient = void 0;
const client_1 = require("@prisma/client");
//adding this comment to check discord pull integration
// declare global {
//   var prismaClient: PrismaClient | undefined;
// }
// export const prismaClient = globalThis.prismaClient || new PrismaClient();
const globalForPrisma = globalThis;
exports.prismaClient = globalForPrisma.prismaClient || new client_1.PrismaClient();
if (process.env.NODE_ENV !== "production")
    globalThis.prismaClient = exports.prismaClient;
