import { Schema, model } from 'mongoose';

const chatSchema = new Schema({
    chat_id: {
        type: String,
        required: true,
        unique: true,
    },
    participants: [
        {
            type: String,
            ref: 'User',
        },
    ],
    chat_createdAt: {
        type: Date,
        default: Date.now(),
    },
});

const messageSchema = new Schema({
    message_id: {
        type: String,
        required: true,
        unique: true,
    },
    chat_id: {
        type: String,
        ref: 'Chat',
        required: true,
        index: true,
    },
    sender_id: {
        type: String,
        ref: 'User',
        required: true,
    }, // obvious other participant is the reciever
    text: {
        type: String,
    },
    attachment: {
        type: String,
    },
    message_createdAt: {
        type: Date,
        default: Date.now(),
    },
    message_updatedAt: {
        type: Date,
        default: Date.now(),
    },
});

// a compound index
messageSchema.index(
    { chat_id: 1, message_createdAt: -1 },
    { name: 'chat_message_createdAt' }
);

export const Message = model('Message', messageSchema);
export const Chat = model('Chat', chatSchema);
