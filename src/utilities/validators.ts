import z from "zod";
import { passwordUtils } from "./helpers";

export const registerSchema = z.object({
  firstName: z.string().min(2, "firstName is required"),
  lastName: z.string().min(2, "lastName is required"),
  email: z.string().email("email is not valid").min(2, "email is required"),
  password: z
    .string()
    .min(4, passwordUtils.error)
    .regex(passwordUtils.regex, passwordUtils.error),
  phone: z.string().min(11, "phone number is required"),
});
export const loginSchema = z.object({
  email: z.string().email("email is not valid").min(2, "email is required"),
  password: z
    .string()
    .min(4, passwordUtils.error)
    .regex(passwordUtils.regex, passwordUtils.error),
});

export const createOrgSchema = z.object({
  name: z.string().min(2, "name is required"),
  description: z.string()
})
