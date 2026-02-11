import {z} from "zod";

//registration validation
export const registerSchema = z.object({
    name: z.string().min(1, "name is required"),
    email: z.string().email("invalid email format"),
    password: z.string().min(6, "password must be at least 6 characters long"),
}).strict();

//login validation
export const loginSchema = z.object({
    email: z.string().email("invalid email format"),
    password: z.string().min(1, "password is required"),
}).strict();

//update validation
export const updateUserSchema = z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
}).strict();