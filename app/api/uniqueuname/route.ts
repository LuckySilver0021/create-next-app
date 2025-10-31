import { z} from 'zod';

import User, { UserModel } from '@/app/db/User';

import { connectToDB } from '@/app/lib/connectToDB';

import { usernameValidation } from '@/app/schemas/signupSchema';


const usernameQuerySchema = z.object({
    username: usernameValidation,
});


export async function GET(request: Request) {
    await connectToDB();

    try{
        const {searchParams} = new URL(request.url);
        const queryParam = {
            username: searchParams.get('username'),
        }
        const result = usernameQuerySchema.safeParse(queryParam);

        
        if (!result.success) {

            return Response.json(
                { 
                    success: false,
                    message: "Invalid query parameter",
                },
                {
                    status: 400,
                }
            );
        }
        
        const { username } = result.data;
        const existingVerifiedUser= await UserModel.findOne({username, isVerified: true});

        if (existingVerifiedUser) {
            return Response.json(
                {
                    success: false,
                    message: "Username already exists",
                },
                {
                    status: 200,
                }
            );

        } else {
            return Response.json(
                {
                    success: true,
                    message: "Username is available", 
                },
                {
                    status: 200,
                }
            );
        }
        
    }
    catch (error) {
        console.error("Error check username:", error);
        return Response.json(
            {
                message: "Error checking username",
                success: false,  
            },
            { status: 500 }
        );
    }
}