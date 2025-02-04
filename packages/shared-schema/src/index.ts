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

export const slidesPdfSchema = z.object({
  pdf: z.instanceof(File).refine(
    (file)=>file.type === 'application/pdf',
    { message:'Invalid file type(only PDF allowed)'}
  )
}).strict()

export const sessionIdSchema = z.object({
  sessionId: z.string()
}).strict();