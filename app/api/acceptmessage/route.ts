import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { connectToDB } from "@/app/lib/connectToDB";
import { UserModel } from "@/app/db/User";


export async function POST(request: Request) {
  await connectToDB();

  const session = await getServerSession(authOptions);
  // @ts-ignore
  const user: User = session?.user;

  if (!session || !user) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const userId = user._id;

  try {
    const body = await request.json();
    const { acceptMessages } = body; // <-- match frontend payload

    // Update user
    // @ts-ignore
    const userGotUpdated = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptMessages },
      { new: true }
    );

    if (!userGotUpdated) {
      return Response.json(
        { success: false, message: "Failed to update user to accept messages" },
        { status: 404 }
      );
    }

    console.log("User status updated successfully:", userGotUpdated);
    return Response.json(
      { success: true, message: "User status updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update user status to accepting messages:", error);
    return Response.json(
      { success: false, message: "Failed to update user status" },
      { status: 500 }
    );
  }
}



export async function GET(request: Request) {
    await connectToDB();
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const user:User=session?.user;
    // @ts-ignore
    if (!session.user || !session) {
        return Response.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        );
    }

    const userId = user._id;
    const founduser=await UserModel.findById(userId)
    try{
        if(!founduser){
            return Response.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }
    else{
        return Response.json(
            { success: true, isAccpetingMessages: founduser.isAcceptingMessages },
            { status: 200 }
        );
    }
    }
    catch (error) {
        console.log("Error in getting message acceptance status:");
        return Response.json(
            { success: false, message: "Error in getting message acceptance status:" },
            { status: 500 }
        );
    }
}