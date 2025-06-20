// import { Webhook } from 'svix';
// import connectDB from '@/app/config/db';
// import User from '@/app/models/User';
// import { NextResponse } from 'next/server';
// import { headers } from 'next/headers';

// export async function POST(req) {
//   console.log('📥 Webhook route hit');

//   const SIGNING_SECRET = process.env.SIGNING_SECRET;

//   if (!SIGNING_SECRET) {
//     console.error("❌ SIGNING_SECRET missing");
//     return new NextResponse("Server misconfiguration", { status: 500 });
//   }

//   const wh = new Webhook(SIGNING_SECRET);

//   const headerPayload = await headers()

//   const svixHeaders = {
//     'svix-id': headerPayload.get('svix-id'),
//     'svix-timestamp': headerPayload.get('svix-timestamp'),
//     'svix-signature': headerPayload.get('svix-signature'),
//   };

//   const payload = await req.json();
//   const body = JSON.stringify(payload);

//   const {data, type} =  wh.verify(payload, svixHeaders)



 

//   const userData = {
//     _id: data.id,
//     name: `${data.firstName ?? ''} ${data.lastName ?? ''}`.trim(),
//     email: data.emailAddresses?.[0]?.emailAddress ?? '',
//     image: data.imageUrl,
//     createdAt: new Date(data.createdAt),
//     updatedAt: new Date(data.updatedAt),
//   };

//   await connectDB();

//   try {
//     switch (type) {
//       case 'user.created':
//         console.log('📝 Creating user:', userData);
//         await User.create(userData);
//         break;

//       case 'user.updated':
//         console.log('🔄 Updating user:', userData);
//         await User.findByIdAndUpdate(userData._id, userData, {
//           new: true,
//           upsert: true,
//         });
//         break;

//       case 'user.deleted':
//         console.log('🗑️ Deleting user:', userData._id);
//         await User.findByIdAndDelete(userData._id);
//         break;

//       default:
//         console.log('⚠️ Unhandled event type:', type);
//     }
//   } catch (err) {
//     console.error('❌ Database error:', err);
//     return new NextResponse('Database operation failed', { status: 500 });
//   }

//   return NextResponse.json({ message: 'Webhook received and processed' });
// }
import { Webhook } from 'svix';
import connectDB from '@/app/config/db';
import User from '@/app/models/User';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  console.log('📥 Webhook route hit');

  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    console.error("❌ SIGNING_SECRET missing");
    return new NextResponse("Server misconfiguration", { status: 500 });
  }

  const wh = new Webhook(SIGNING_SECRET);
  const headerPayload = headers();

  const svixHeaders = {
    'svix-id': headerPayload.get('svix-id'),
    'svix-timestamp': headerPayload.get('svix-timestamp'),
    'svix-signature': headerPayload.get('svix-signature'),
  };

  const rawBody = await req.text(); // <-- FIXED: Get raw body as string

  let evt;
  try {
    evt = wh.verify(rawBody, svixHeaders);
  } catch (err) {
    console.error('❌ Signature verification failed:', err);
    return new NextResponse('Invalid signature', { status: 400 });
  }

  const { data, type } = evt;

  const userData = {
    _id: data.id,
    name: `${data.firstName ?? ''} ${data.lastName ?? ''}`.trim(),
    email: data.emailAddresses?.[0]?.emailAddress ?? '',
    image: data.imageUrl,
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt),
  };

  await connectDB();

  try {
    switch (type) {
      case 'user.created':
        console.log('📝 Creating user:', userData);
        await User.create(userData);
        break;

      case 'user.updated':
        console.log('🔄 Updating user:', userData);
        await User.findByIdAndUpdate(userData._id, userData, {
          new: true,
          upsert: true,
        });
        break;

      case 'user.deleted':
        console.log('🗑️ Deleting user:', userData._id);
        await User.findByIdAndDelete(userData._id);
        break;

      default:
        console.log('⚠️ Unhandled event type:', type);
    }
  } catch (err) {
    console.error('❌ Database error:', err);
    return new NextResponse('Database operation failed', { status: 500 });
  }

  return NextResponse.json({ message: 'Webhook received and processed' });
}
