'use server'
import { RegisterSchema, SignInSchema } from "@/lib/zod"
import { hashSync } from "bcryptjs";
import prisma from "./db";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export const signUpCredentials = async(prevState: unknown, formdata: FormData) => {
    const validateField = RegisterSchema.safeParse(Object.fromEntries(formdata.entries()));

    if (!validateField.success){
        return {
            error: validateField.error.flatten().fieldErrors,
        }
    }

    const {name, email, password} = validateField.data;
    const hashedPassword = hashSync(password, 10)

    try {
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            }
        })
    }catch (error) {
        console.error('Registration error:', error);
        return { 
          message: 'Database error: Failed to register user',
          errors: {}
        };
    }

    redirect("/login")
}

// Sign In

export const signInCredentials = async(prevState: unknown, formdata: FormData) => {
    const validateField = SignInSchema.safeParse(Object.fromEntries(formdata.entries()));

    if (!validateField.success){
        return {
            error: validateField.error.flatten().fieldErrors,
        }
    }

    const { email, password} = validateField.data;

    try {
        await signIn("credentials", {email, password, redirectTo:"/"})
    } catch (error) {
        if(error instanceof AuthError){
            switch (error.type) { 
                case "CredentialsSignin":
                    return {message: "Invalid Credentials"}
                default:
                    return {message: "Something went wrong"}
            }
        }
        throw error;
    }
}