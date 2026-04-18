import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../middleware/auth";
import { Chat } from "../models/chat.models";
import { Types } from "mongoose";

export async function getChats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.userId;

        const chats = await Chat.find({ participants: userId })
            .populate("participants", "name email avatar")
            .populate('lastMessages')
            .sort({ lastMessagesAt: -1 });

        const formattedChats = chats.map(chat => {
            const otherParticipant = chat.participants.find(
                (p) => p._id.toString() !== userId
            );

            return {
                _id: chat._id,
                participants: otherParticipant ?? null,
                lastMessages: chat.lastMessages,
                lastMessagesAt: chat.lastMessagesAt,
                createdAt: chat.createdAt
            };
        });

        res.json({
            success: true,
            chats: formattedChats
        });
    } catch (error) {
        next(error);
    }
};

export async function getOrCreateChat(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.userId;
        const { participantId } = req.params;

        if (!participantId || typeof participantId !== "string") {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Participant ID is required"
                });
        }

        if (!Types.ObjectId.isValid(participantId)) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Invalid participant ID"
                });
        }

        if (userId === participantId) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Cannot create chat with yourself"
                });
        }

        // Check if chat already exists
        let chat = await Chat.findOne({
            participants: {
                $all: [userId, participantId]
            }
        })
            .populate("participants", "name email avatar")
            .populate('lastMessages');

        if (!chat) {
            const newChat = new Chat({
                participants: [userId, participantId]
            });
            await newChat.save();
            chat = await newChat.populate("participants", "name email avatar");
        }

        const otherParticipant = chat.participants.find(
            p => p._id.toString() !== userId
        );

        res
            .status(200)
            .json({
                success: true,
                _id: chat._id,
                participants: otherParticipant,
                lastMessages: chat.lastMessages,
                lastMessagesAt: chat.lastMessagesAt,
                createdAt: chat.createdAt
            });
    } catch (error) {
        res.status(500)
        next(error);
    }
}