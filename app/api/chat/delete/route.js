import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "User not authenticated",
      });
    }

    const { chatId } = await req.json();

    const deletedChat = await Chat.findOneAndDelete({
      _id: chatId,
      userId,
    });

    if (!deletedChat) {
      return NextResponse.json({
        success: false,
        message: "Chat not found or not authorized",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Chat deleted successfully",
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}
