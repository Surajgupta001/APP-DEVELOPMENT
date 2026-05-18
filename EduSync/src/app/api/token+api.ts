import { StreamChat } from 'stream-chat';

const api_key = process.env.EXPO_PUBLIC_STREAM_API_KEY as string
const secret_key = process.env.STREAM_SECRET_KEY as string

export async function POST(request: Request) {
    const client = StreamChat.getInstance(api_key, secret_key);

    const body = await request.json();

    const userId = body?.userId;

    if (!userId) {
        return Response.json({
            success: false,
            message: "Missing userId in request body",
            error: 'user Id is required'
        }, {
            status: 400
        })
    }

    const token = client.createToken(userId);

    return Response.json({
        success: true,
        message: "Token generated successfully",
        token
    }, {
        status: 200
    });
};