// /app/api/chat/route.js (for Next.js App Router)
import { NextResponse } from 'next/server';
import connectDB from '@/app/config/db';
import Chat from '@/app/models/Chat';
import { getAuth } from '@clerk/nextjs/dist/types/server';

export async function POST(req) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
        return NextResponse.json({ success: false, message: 'Unauthorized' });
    }

    const chatData = {
      userId,
      messages: [],
      name: "New Chat",
    };

    await connectDB();
    await Chat.create(chatData);

    return NextResponse.json({ success: true, message: "Chat created" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
