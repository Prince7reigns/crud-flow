import { z} from "zod"

export const registerSchema = z.object({
    body:z.object({
        name:z.string({
             required_error: 'Name is required',
             invalid_type_error: 'Name must be text',
            })
         .trim()
         .min(3,'Name is too short')
         .max(60,'Name is too long'),
        email:z.string({
             required_error: 'Name is required',
             invalid_type_error: 'Name must be text',
        })
         .trim()
         .lowercase()
         .email('invaild email'),
        password:z.string({
             required_error: 'Name is required',
             invalid_type_error: 'Name must be text',
        })
         .min(8,'password is too short')
         .regex(/[A-Za-z]/, 'Needs a letter')
         .regex(/\d/, 'Needs a number'),
    })
})

export const loginSchema = z.object({
    body:z.object({
        email: z.string({
             required_error: 'Name is required',
             invalid_type_error: 'Name must be text',
        })
         .trim()
         .toLowerCase()
         .email('Invalid email'),
        password:z.string({
             required_error: 'Name is required',
             invalid_type_error: 'Name must be text',
        })
         .min(1,'password is required')
    })
})


