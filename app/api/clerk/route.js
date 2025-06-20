// /app/api/webhooks/clerk/route.js
import { Webhook } from 'svix';
import connectDB from '@/app/config/db';
import User from '@/app/models/User';
import { NextResponse } from 'next/server';

export async function POST(req) {
    console.log('📥 Webhook route hit');

    const wh = new Webhook(process.env.SIGNING_SECRET);

    const svixHeaders = {
        'svix-id': req.headers.get('svix-id'),
        'svix-timestamp': req.headers.get('svix-timestamp'),
        'svix-signature': req.headers.get('svix-signature')
    };

    const payload = await req.text(); // 👈 must use text for svix verification
    let event;

    try {
        event = wh.verify(payload, svixHeaders);
    } catch (err) {
        console.error('❌ Signature verification failed:', err.message);
        return new NextResponse('Invalid signature', { status: 400 });
    }

    const { data, type } = event;
    console.log(`📦 Event type: ${type}`);

    const userData = {
        _id: data.id,
        name: `${data.firstName ?? ''} ${data.lastName ?? ''}`.trim(),
        email: data.emailAddresses?.[0]?.emailAddress ?? '',
        image: data.imageUrl,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
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
                    upsert: true
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
        console.error('❌ DB operation failed:', err);
        return new NextResponse('DB operation error', { status: 500 });
    }

    return NextResponse.json({
        message: 'Webhook received and processed successfully'
    });
}
