
import { getAuth } from '@clerk/nextjs/server'; 
import { NextResponse } from "next/server";
import Chat from '@/app/models/Chat';
import connectDB from '@/app/config/db';
export async function POST(req) {
  try {
    const { userId } = getAuth(req);

    const {chatId} = await req.json();


    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "User not authenticated",
      });
    }
   
     await connectDB();

     await Chat.deleteOne({ _id: chatId, userId });
    

    // const deletedChat = await Chat.findOneAndDelete({
    //   _id: chatId,
    //   userId,
    // });

    // if (!deletedChat) {
    //   return NextResponse.json({
    //     success: false,
    //     message: "Chat not found or not authorized",
    //   });
    // }

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
