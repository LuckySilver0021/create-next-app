
import { connectToDB } from "@/app/lib/connectToDB"; 
import { UserModel } from "@/app/db/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await connectToDB();
  try {
    const { identifier, password } = await request.json();

    const user = await UserModel.findOne({
      $or: [{ username: identifier }, { email: identifier }],
      isVerified: true,
    });

    if (!user) {
      return Response.json(
        { message: "User not found", success: false },
        { status: 401 }
      );
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return Response.json(
        { message: "Invalid password", success: false },
        { status: 401 }
      );
    }

    return Response.json(
      { message: "User signed in successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
