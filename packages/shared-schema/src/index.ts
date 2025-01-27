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
  role: z.enum(["ADMIN","USER","SUPER_ADMIN"])
}).strict();
