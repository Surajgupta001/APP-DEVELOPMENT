import { Socket, Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";
import { verifyToken } from "@clerk/express";
import { User } from "../models/user.models";
import { Message } from "../models/messages.models";
import { Chat } from "../models/chat.models";

interface SocketWithUserId extends Socket {
    userId: string;
}

// Store online users in memory : (userId -> socketId)
export const onlineUsers: Map<string, string> = new Map();

export const initializeSocket = (httpServer: HttpServer) => {
    const allowedOrigin = [
        'http://localhost:8081', // Expo mobile
        'http://localhost:5173', // React web
        process.env.FRONTEND_URL as string, // Production
    ];

    const io = new SocketServer(httpServer, {
        cors: {
            origin: allowedOrigin
        }
    });

    // Verify socket connection - if the user is authenticated, we will store the user id in the socket
    io.use(async (socket, next) => {
        const token = socket.handshake.auth.token; // This is waht user will send from client

        if (!token) {
            return next(new Error("Authentication error"));
        }

        try {
            const session = await verifyToken(token, {
                secretKey: process.env.CLERK_SECRET_KEY! as string,
            });

            if (!session) {
                return next(new Error("Authentication error"));
            }

            const clerkId = session.sub;

            const user = await User.findOne({ clerkId });

            if (!user) {
                return next(new Error("User not found"));
            }

            (socket as SocketWithUserId).userId = user._id.toString();
            next();
        } catch (error: any) {
            next(new Error(error))
        }
    });

    // This 'connection' event name is special and should be written like This
    // it's the event that is triggered a new client connects to the server
    io.on("connection", (socket) => {
        const userId = (socket as SocketWithUserId).userId;

        // Send list of currently online to the newly connected client
        socket.emit("online-users", {
            userId: Array.from(onlineUsers.keys())
        });

        // Store user in online users map
        onlineUsers.set(userId, socket.id);

        // Notify others thar this current user is online
        socket.broadcast.emit("user-online", {
            userId
        });

        socket.join(`user_${userId}`);

        socket.on('join-chat', (chatId: string) => {
            socket.join(`chat:${chatId}`);
        });

        socket.on('leave-chat', (chatId: string) => {
            socket.leave(`chat:${chatId}`);
        });

        // Handle sending messages
        socket.on('send-messages', async (data: { chatId: string; text: string; }) => {
            try {
                const { chatId, text } = data;

                const chat = await Chat.findOne({
                    _id: chatId,
                    participants: userId
                })

                if (!chat) {
                    socket.emit('Socket-error', {
                        messages: 'Chat not found'
                    });
                    return;
                }

                const message = new Message({
                    chat: chatId,
                    sender: userId,
                    text: text,
                });

                chat.lastMessages = message._id as any;
                chat.lastMessagesAt = new Date();
                await chat.save();

                await message.populate('sender', 'name email avatar');

                // Emit to chat room (for users inside the chat)
                io.to(`chat:${chatId}`).emit('new-message', message);

                // Also emit to participants personal room (for chat list view)
                for (const participantId of chat.participants) {
                    io.to(`user_${participantId}`).emit('new-message', message);
                }
            } catch (error) {
                socket.emit('soket-error', {
                    message: 'Failed to send message'
                })
            }
        });

        // Handle typing
        // TODO: LATER
        socket.on('typing', async (data) => {

        });

        // Handle disconnect
        socket.on('disconnect', () => {
            onlineUsers.delete(userId);

            // Notify others
            socket.broadcast.emit('user-offline', { userId });
        });
    });

    return io;
};