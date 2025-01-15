import { PrismaClient } from "@prisma/client";
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

// declare global {
//   var prisma: PrismaClient | undefined;
// }
//@ts-ignore
export const prisma = global.prisma || new PrismaClient();
//@ts-ignore
if (process.env.NODE_ENV !== "production") global.prisma = prisma;
