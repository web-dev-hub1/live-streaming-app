import { PrismaClient } from "@prisma/client";
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

<<<<<<< Updated upstream
export const prisma = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
=======
//adding this comment to check discord pull integration

// declare global {
//   var prismaClient: PrismaClient | undefined;
// }


// export const prismaClient = global.prismaClient || new PrismaClient();

// if (process.env.NODE_ENV !== "production") global.prismaClient = prismaClient;

export const prismaClient=new PrismaClient();
>>>>>>> Stashed changes
