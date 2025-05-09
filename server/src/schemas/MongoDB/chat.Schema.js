import { Schema, model } from 'mongoose';
import { v4 as uuid } from 'uuid';

const chatSchema = new Schema({
    chat_id: {
        type: String,
        required: true,
        unique: true,
        default: () => uuid(),
    },
    isGroupChat: {
        type: Boolean,
        default: false,
    },
    chat_name: {
        type: String,
    },
    creator: {
        type: String,
        ref: 'User',
        default: null,
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
                default: 'member',
            },
        },
    ],
    lastMessage: {
        message: {
            type: String,
            default: '',
        },
        time: {
            type: Date,
            default: '',
        },
    },
    chat_createdAt: {
        type: Date,
        default: Date.now(),
    },
});

export const Chat = new model('Chat', chatSchema);
