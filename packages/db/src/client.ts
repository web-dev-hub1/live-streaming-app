import { PrismaClient } from "@prisma/client";
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

export const prisma = new PrismaClient();

export { Role } from '@prisma/client'
