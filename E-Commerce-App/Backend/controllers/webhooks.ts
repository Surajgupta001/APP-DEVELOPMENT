import { verifyWebhook } from "@clerk/express/webhooks";
import { clerkClient, getAuth } from "@clerk/express";
import { Request, Response } from "express";
import User from "../models/user.models.js";

type UserUpsertPayload = {
    clerkId: string;
    email?: string;
    name?: string;
    image?: string;
};

const upsertUser = async (payload: UserUpsertPayload) => {
    const name = (payload.name ?? '').trim();

    await User.findOneAndUpdate(
        { clerkId: payload.clerkId },
        {
            clerkId: payload.clerkId,
            email: payload.email,
            name,
            image: payload.image,
        },
        {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
        },
    );
};

export const clerkWebhook = async (req: Request, res: Response) => {
    try {
        const evt = await verifyWebhook(req);

        console.log(`Clerk webhook received: ${evt.type}`);

        if (evt.type === 'user.created' || evt.type === 'user.updated') {
            const userData: UserUpsertPayload = {
                clerkId: evt.data.id,
                email: evt.data.email_addresses[0]?.email_address,
                name: `${evt.data.first_name ?? ''} ${evt.data.last_name ?? ''}`,
                image: evt.data?.image_url,
            };

            await upsertUser(userData);
        }

        if (evt.type === 'user.deleted' && evt.data.id) {
            await User.deleteOne({ clerkId: evt.data.id });
        }

        return res
            .status(200)
            .json({
                success: true,
                message: 'Webhook received and processed successfully',
            });

    } catch (err) {
        console.error('Error verifying webhook:', err)
        return res.status(400).send('Error verifying webhook')
    }
};

export const syncCurrentUser = async (req: Request, res: Response) => {
    try {
        const { userId } = getAuth(req);

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const clerkUser = await clerkClient.users.getUser(userId);

        const userData: UserUpsertPayload = {
            clerkId: clerkUser.id,
            email: clerkUser.emailAddresses[0]?.emailAddress,
            name: `${clerkUser.firstName ?? ''} ${clerkUser.lastName ?? ''}`,
            image: clerkUser.imageUrl,
        };

        await upsertUser(userData);

        return res.status(200).json({
            success: true,
            message: 'User synced successfully',
        });
    } catch (error) {
        console.error('Error syncing current user:', error);
        return res.status(500).json({ success: false, message: 'Failed to sync user' });
    }
};