import {Webhook} from 'svix';
import connectDB from '@/app/config/db';
import User from '@/app/models/User';
import { NextRequest } from 'next/server';

export async function POST(req) {
    const wh = new Webhook(process.env.SIGNING_SECRET);

    const headerPlayload = await headers()

    const svixHeaders = {
        'svix-id': headerPlayload.get('svix-id'),
        'svix-timestamp': headerPlayload.get('svix-timestamp'),
        'svix-signature': headerPlayload.get('svix-signature')
    };
    
    

    const playload = await req.json();
    const body = JSON.stringify(playload);
    const { data, type } = wh.verify(body, svixHeaders);


    const userData ={
        _id: data.id,
        name: data.firstName + ' ' + data.lastName,
        email: data.emailAddresses[0].emailAddress,
        image: data.imageUrl,
        createdAt: data.createdAt, 
        updatedAt: data.updatedAt 
    }

    await connectDB();


    switch (type) {
        case 'user.created':
            await User.create(userData);
            break;  

        case 'user.updated':
           await User.findOneAndUpdate(userData)
            break;
        case 'user.deleted':
            await User.findOneAndDelete({_id: userData._id});
            break;
        default:
            console.log('Unhandled event type:', type);
            break;
    }
    return NextRequest.json({
        message: 'Webhook received and processed successfully',}
    )


}

