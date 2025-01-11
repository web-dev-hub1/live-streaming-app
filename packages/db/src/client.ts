import { PrismaClient } from "@prisma/client";

//adding this comment to check discord pull integration

declare global {
  var prisma: PrismaClient | undefined;
}


export const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;