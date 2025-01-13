import { PrismaClient } from "@prisma/client";

//adding this comment to check discord pull integration

declare global {
  var prismaClient: PrismaClient | undefined;
}


export const prismaClient = globalThis.prismaClient || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prismaClient = prismaClient;