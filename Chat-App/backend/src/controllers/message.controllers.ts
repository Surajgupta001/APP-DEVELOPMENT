import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../middleware/auth";
import { Chat } from "../models/chat.models";
import { Message } from "../models/messages.models";

export async function getMessages(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.userId;
        const { chatId } = req.params;

        const chat = await Chat.findOne({
            _id: chatId,
            participants: userId
        });

        if (!chat) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: "Chat not found"
                });
        }

        const messages = await Message.find({
            chat: chatId
        })
            .populate('sender', 'name email, avatar')
            .sort({ createdAt: 1 }); // Oldest first

        res
            .status(200)
            .json({
                success: true,
                messages
            });
    } catch (error) {
        next(error);
    }
}