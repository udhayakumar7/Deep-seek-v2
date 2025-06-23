// export const maxDuration = 60; // seconds

// import OpenAI from "openai";
// import { getAuth } from "@clerk/nextjs/server";
// import Chat from "@/app/models/Chat";
// import { NextResponse } from "next/server";
// import connectDB from "@/app/config/db";

// const openai = new OpenAI({
//         baseURL: 'https://api.deepseek.com',
//         apiKey: process.env.DEEPSEEK_API_KEY,
// });

// export async function POST(req) {

//     try{
//          const { userId } = getAuth(req);

//          const {chatId, prompt} = await req.json();

//          if (!userId) {
//             return NextResponse.json({
//                 success: false,
//                 message: "User not authenticated",
//             })
//         }
//        await connectDB();
//         const data = await Chat.findOne({userId, _id: chatId});

//         const userPrompt ={

//             role: "user",
//             content: prompt,
//             time: Date.now(),

//         };

//         data.messages.push(userPrompt);

//           const completion = await openai.chat.completions.create({
//     messages: [{ role: "user", content: prompt }],
//     model: "deepseek-chat",
//     store: true
//   });
  
//   const message = completion.choices[0].message;
//   message.timestamp = Date.now();
//   data.messages.push(message);

//   data.save();

//         return NextResponse.json({
//             success: true,
//             data: message,
//         });
  
//   }
  
//      catch (error) {
//         console.error("Error in POST request:", error);
//         return NextResponse.json({
//             success: false,
//             error: error.message,
//         });
 
//     };  

 


// }


export const maxDuration = 60; // seconds

import { GoogleGenerativeAI } from "@google/generative-ai";
import { getAuth } from "@clerk/nextjs/server";
import Chat from "@/app/models/Chat";
import { NextResponse } from "next/server";
import connectDB from "@/app/config/db";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    const { chatId, prompt } = await req.json();

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "User not authenticated",
      });
    }

    await connectDB();
    const data = await Chat.findOne({ userId, _id: chatId });

    const userPrompt = {
      role: "user",
      content: prompt,
      timestamp: Date.now(),
    };

    data.messages.push(userPrompt);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const response = result.response;
    const text = await response.text(); // ✅ await this call

    const message = {
      role: "assistant",
      content: text,
      timestamp: Date.now(),
    };

    data.messages.push(message);
    await data.save();

    return NextResponse.json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}
