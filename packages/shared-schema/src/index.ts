import { z } from "zod";

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: "Password must be at least 8 characters" })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
  .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
  .regex(/[0-9]/, { message: "Password must contain at least one number" })
  .regex(/[@$!%?&]/, { message: "Password must contain at least one special character (@, $, !, %,, ?, &)" })
}).strict();

export const signupSchema = z.object({
  email: z.string().email(),
  userName: z.string().min(3).max(15),
  password: z.string().min(8, { message: "Password must be at least 8 characters" })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
  .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
  .regex(/[0-9]/, { message: "Password must contain at least one number" })
  .regex(/[@$!%?&]/, { message: "Password must contain at least one special character (@, $, !, %,, ?, &)" })
}).strict();

export const rolesEnumSchema = z.object({
  role: z.enum(["ADMIN","USER","SUPER_ADMIN"])
}).strict();

export const sessionSchema = z.object({
  title: z.string().min(3),
  description: z.string(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  thumbnail: z.string().optional(),
  slides: z.object({}).optional(),
  videoLink: z.string().optional(),
}).strict();