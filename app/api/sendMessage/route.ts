import { MessageModel, UserModel } from "@/app/db/User";
import { connectToDB } from "@/app/lib/connectToDB";

export async function POST(request: Request) {
    await connectToDB();
    const { username, content } = await request.json();
    try{
        const user = await UserModel.findOne({ username });
        if (!user) {
            return Response.json({ success: false, message: "User not found" }, { status: 404 });
        }
        else if (!user.isAcceptingMessages) {
            return Response.json({ success: false, message: "User is not accepting messages" }, { status: 403 });
        }

        const message = new MessageModel({
            content,
            createdAt: new Date(),
        });
        user.messages.push(message);
        await user.save();

        return Response.json({ success: true, message: "Message sent successfully" }, { status: 200 });
    }

    catch (error) {
        console.error("Error sending message:", error);
        return Response.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}