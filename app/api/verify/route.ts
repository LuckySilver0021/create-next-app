

import { UserModel } from '@/app/db/User';

import { connectToDB } from '@/app/lib/connectToDB';

import { usernameValidation } from '@/app/schemas/signupSchema';



//FEATURES TO ADD:
//ADD ZOD VALIDATION


export async function POST(request: Request) {
    await connectToDB();
    try{
        const {username,code} = await request.json();
        const decodedUsername=decodeURIComponent(username);
        const user=await UserModel.findOne({username:decodedUsername});
        console.log(user);
        if(!user){
            return Response.json(
                { 
                    success: false,
                    message: "User not found",
                },
                {
                    status: 404,
                }
            );
        }
        else{
            const isValid=user.verifyCode === code && user.verifyCodeExpiry > new Date();
            if(isValid){
                user.isVerified = true;
                await user.save();
                return Response.json(
                    { 
                        success: true,
                        message: "User verified successfully",
                    },
                    {
                        status: 200,
                    }
                );
            }
            else if(user.verifyCodeExpiry < new Date()){
                return Response.json(
                    { 
                        success: false,
                        message: "Verification code has expired.",
                    },
                    {
                        status: 400,
                    }
                );
            }
            else{
                return Response.json(
                    { 
                        success: false,
                        message: "Invalid verification code",
                    },
                    {
                        status: 400,
                    }
                );
            }
        }
    }
    catch (error) {
        console.error("Error verifying user:", error);
        return Response.json(
            { 
                success: false,
                message: "Error verifying user",
            },
            {
                status: 500,
            }
        );
    }
}