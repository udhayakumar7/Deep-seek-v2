import { NextResponse } from 'next/server';
import connectDB from '@/app/config/db';
import Chat from '@/app/models/Chat';
import { auth, getAuth } from '@clerk/nextjs/server'; 

export async function POST(req) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const newChat = await Chat.create({
      userId,
      messages: [],
      name: "New Chat",
    });

    return NextResponse.json({ success: true, data: newChat }, { status: 201 }); // ✅ Return created chat
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
