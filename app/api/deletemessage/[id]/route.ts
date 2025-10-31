import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { connectToDB } from "@/app/lib/connectToDB";
import { UserModel } from "@/app/db/User";
import { User } from "next-auth";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> } // <- params is now a Promise
) {
  const { id: msgid } = await context.params; // <- unwrap the promise

  const session = await getServerSession(authOptions);
  //@ts-ignore
  const user = session?.user as User;

  if (!session) return new Response("Unauthorized", { status: 401 });

  await connectToDB();

  try {
    const userGotUpdated = await UserModel.updateOne(
      { _id: user._id },
      {
        $pull: {
          messages: {
            _id: msgid,
          },
        },
      }
    );

    if (userGotUpdated.modifiedCount === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "Message not found or already deleted" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Message deleted successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in deleting message:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Error deleting message" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
