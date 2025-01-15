import { PrismaClient } from "@prisma/client";
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

//@ts-ignore
export const prisma = globalThis.prisma || new PrismaClient();
//@ts-ignore
if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
