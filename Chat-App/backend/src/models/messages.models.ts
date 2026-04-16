import mongoose, { Schema, type Document } from "mongoose";

export interface IMessage extends Document {
    chat: mongoose.Types.ObjectId; // Reference to the Chat
    sender: mongoose.Types.ObjectId; // Reference to the User who sent the message
    text: string; // The content of the message
    createdAt: Date;
    updatedAt: Date;
};

const MessageSchema = new Schema<IMessage>({
    chat: {
        type: Schema.Types.ObjectId,
        ref: "Chat",
        required: true,
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
        required: true,
        trim: true,
    },
}, {
    timestamps: true,
});

// Indexes for faster Queries
MessageSchema.index({
    chat: 1,
    createdAt: 1, // Older one first
    // 1 => Ascending order,
    // -1 => Descending order
});

export const Message = mongoose.model<IMessage>("Message", MessageSchema);