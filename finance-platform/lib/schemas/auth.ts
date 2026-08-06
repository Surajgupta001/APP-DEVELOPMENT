import { z } from "zod";

export const signUpSchema = z.object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    emailAddress: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
});

export type SignUpFormSchema = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
    emailAddress: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
});

export type SignInFormSchema = z.infer<typeof signInSchema>;

export const codeSchema = z.object({
    code: z.string().min(1, { message: "Enter your verification code" }),
})

export type CodeFormSchema = z.infer<typeof codeSchema>;