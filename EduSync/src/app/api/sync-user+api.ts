import { StreamChat } from 'stream-chat';
import * as Sentry from '@sentry/react-native';

const api_key = process.env.EXPO_PUBLIC_STREAM_API_KEY as string
const secret_key = process.env.STREAM_SECRET_KEY as string

export async function POST(request: Request) {
    const client = StreamChat.getInstance(api_key, secret_key);
    const body = await request.json();

    const { userId, name, image } = body;

    if (!userId) {
        return Response.json({
            success: false,
            message: "Missing userId in request body",
            error: 'userId is required'
        }, {
            status: 400
        })
    }

    try {
        await client.upsertUser({
            id: userId,
            name: name || `User ${userId}`,
            image: image,
        })

        return Response.json({
            success: true,
            message: "User synced successfully"
        }, {
            status: 200
        })
    } catch (error) {
        console.error("Error syncing user with Stream Chat", { error, userId });
        Sentry.captureException(error, {
            extra: {
                userId,
                name,
                image
            }
        });
        return Response.json({
            success: false,
            message: "Error syncing user with Stream Chat"
        }, {
            status: 500
        })
    }
};