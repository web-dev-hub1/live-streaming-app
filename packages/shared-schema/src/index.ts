import { Role } from "@repo/db/client";
import { z } from "zod";

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
}).strict();

export const signupSchema = z.object({
  email: z.string().email(),
  userName: z.string().min(3).max(15),
  password: z.string().min(8),
}).strict();

export const rolesEnumSchema = z.object({
  role: z.nativeEnum(Role)
}).strict();

export const slidesPdfSchema = z.object({
  pdf: z.object({
    mimetype: z.string()
  }).refine(obj => obj.mimetype === 'application/pdf')
}).strict()

export const sessionIdSchema = z.object({
  sessionId: z.string()
}).strict();