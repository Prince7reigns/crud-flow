import { z} from "zod"

export const registerSchema = z.object({
    body:z.object({
        name:z.string()
         .trim()
         .min(3,'Name is too short')
         .max(60,'Name is too long'),
        email:z.string()
         .trim()
         .lowercase()
         .email('invaild email'),
        password:z.string()
         .min(8,'password is too short')
         .regex(/[A-Za-z]/, 'Needs a letter')
         .regex(/\d/, 'Needs a number'),
    })
})

export const loginSchema = z.object({
    body:z.object({
        email: z.string()
         .trim()
         .toLowerCase()
         .email('Invalid email'),
        password:z.string()
         .min(1,'password is required')
    })
})


