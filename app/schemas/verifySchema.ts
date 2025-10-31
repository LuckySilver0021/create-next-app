import {z} from 'zod';


export const verifySchema= z.object({
    code: z.string().length(5, {message: "Verification code must be exactly 5 characters long"}),
})

