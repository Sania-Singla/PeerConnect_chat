import { Schema, model } from 'mongoose';
import { v4 as uuid } from 'uuid';

const chatSchema = new Schema({
    chat_id: {
        type: String,
        required: true,
        unique: true,
        default: uuid(),
    },
    isGroupChat: {
        type: Boolean,
        default: false,
    },
    chat_name: {
        type: String,
        default: '', // only exists if group chat
    },
    creator: {
        type: String,
        ref: 'User',
        default: '',
    },
    members: [
        {
            user_id: {
                type: String,
                ref: 'User',
            },
            role: {
                type: String,
                enum: ['admin', 'member'],
            },
        },
    ],
    lastMessage: {
        type: String,
        default: '',
    },
    chat_createdAt: {
        type: Date,
        default: Date.now(),
    },
});

export const Chat = model('Chat', chatSchema);
