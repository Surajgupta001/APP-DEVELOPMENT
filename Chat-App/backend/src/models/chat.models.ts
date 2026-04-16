import mongoose, { Schema, type Document } from "mongoose";

export interface IChat extends Document {
    participants: mongoose.Types.ObjectId[]; // Array of User IDs
    lastMessages?: mongoose.Types.ObjectId; // Array of Message IDs (optional, for quick access to recent messages)
    lastMessagesAt?: Date; // Timestamp of the last message (optional, for sorting chats by recent activity)
    createdAt: Date;
    updatedAt: Date;
}

const ChatSchema = new Schema<IChat>({
    participants: [{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }],
    lastMessages: {
        type: Schema.Types.ObjectId,
        ref: "Message",
        default: null
    },
    lastMessagesAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

export const Chat = mongoose.model<IChat>("Chat", ChatSchema);