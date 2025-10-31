import {z} from 'zod';

export const usernameValidation = z.string().min(2, "Username must be at least 3 characters long");


export const signupSchema = z.object({
    username: usernameValidation,
   email: z.string()
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: "Invalid email address" }),
    password: z.string().min(4,{message: "Password must be at least 4 characters long"})
});
