import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../middleware/auth";
import { User } from "../models/user.models";
import { clerkClient, getAuth } from "@clerk/express";

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: "User not found"
                });
        }

        return res
            .status(200)
            .json({
                success: true,
                user
            });
    } catch (error) {
        console.error("Error fetching user:", error);
        next(error);
    }
};

export const authCallBack = async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { userId: clerkId } = getAuth(req);

        if (!clerkId) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "Unauthorized"
                });
        }

        let user = await User.findOne({ clerkId });

        if (!user) {
            // Get user info from clerk and save to database
            const clerkUser = await clerkClient.users.getUser(clerkId);
            const primaryEmail = clerkUser.emailAddresses?.[0]?.emailAddress || "";
            const fallbackName = primaryEmail ? primaryEmail.split("@")[0] : "User";

            user = await User.create({
                clerkId,
                name: clerkUser.firstName
                    ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim()
                    : fallbackName,
                email: primaryEmail,
                avatar: clerkUser.imageUrl
            });
        }

        return res
            .status(200)
            .json({
                success: true,
                user
            });
    } catch (error) {
        console.error("Error in auth callback:", error);
        next(error);
    }
};
