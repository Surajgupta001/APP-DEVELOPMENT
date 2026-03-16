import { Request, Response, NextFunction } from 'express';
import User from "../models/user.models.js";

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = await req.auth();

        if (!userId) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: 'Not authorized'
                });
        }

        const user = await User.findOne({
            clerkId: userId
        });

        if (!user) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: 'User profile not found. Please sync user first.'
                });
        }

        req.user = user;
        next();


    } catch (error) {
        console.error('Auth erro', error)
        return res
            .status(500)
            .json({
                success: false,
                message: 'Server error'
            });
    }
};

export const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: 'Not authorized'
                });
        }

        if (!roles.includes(req.user.role)) {
            return res
                .status(403)
                .json({
                    success: false,
                    message: `User role ${req.user.role} is not authorized to access this route`
                });
        }
        next();
    }
};