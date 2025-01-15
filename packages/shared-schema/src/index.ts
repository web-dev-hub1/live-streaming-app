import { z } from "zod";

 export const signinSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });

  export const signupSchema = z.object({
    email: z.string().email(),
    userName: z.string().min(3).max(10),
    password: z.string().min(8),
  });