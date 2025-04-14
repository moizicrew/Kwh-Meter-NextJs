import {object, string} from 'zod'

export const RegisterSchema = object({
    name : string().min(1, "Name must be more than 1 character"),
    email: string().email("Invalid email"),
    password: string().min(8, "Password must be more than 8 character").max(32,"Password must be less than 32 Characters"),
    ConfirmPassword: string().min(8, "Password must be more than 8 character").max(32,"Password must be less than 32 Characters")
}).refine((data) => data.password === data.ConfirmPassword,{
    message: "Password does not match",
    path: ["ConfirmPassword"]
})

export const SignInSchema = object({
    email: string().email("Invalid email"),
    password: string().min(8, "Password must be more than 8 character").max(32,"Password must be less than 32 Characters"),
})