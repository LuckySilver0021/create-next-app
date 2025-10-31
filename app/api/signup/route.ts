import { connectToDB } from "@/app/lib/connectToDB";
import { UserModel } from "../../db/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/app/helper/sendVerifmail";


export async function POST(request: Request) {
  await connectToDB();

  try {
    const { username, email, password } = await request.json();

    // Check if username already exists and is verified
    const verifiedUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (verifiedUsername) {
      return Response.json(
        {
          message: "Username already exists",
          success: false,
        },
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });

    const verifyCode = Math.floor(10000 + Math.random() * 90000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            message: "User already registered and verified",
            success: false,
          },
          { status: 400 }
        );
      }
      else{
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password= hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
        const updatedUser = await UserModel.findOne({ email });
        console.log("Updated user in DB:", updatedUser);
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode: verifyCode,
        verifyCodeExpiry: expiryDate,
        isAcceptingMessages: true,
        isVerified: false,
        messages: [],
      });

      await newUser.save();
      const savedUser = await UserModel.findOne({ email }); 
      console.log("User saved in DB:", savedUser);
    }
    const emailRes = await sendVerificationEmail(email, username, verifyCode);
    if (emailRes.success) {
      return Response.json(
        {
          message: "User registered successfully. Verification email sent.",
          success: true,
        },
        { status: 201 }
      );
    }
    else{
        console.error("Error sending verification email:", emailRes.message);
        return Response.json(
            {
              message: "Error sending verification email",
              success: false,
        },{status: 500})
    }
  } catch (error) {
    console.error("Error registering user:", error);
    return Response.json(
      {
        message: "Error registering user",
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}



