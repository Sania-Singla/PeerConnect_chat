import { Schema, Types, model } from 'mongoose';

const chatSchema = new Schema({
    chat_id: {
        type: String,
        required: true,
        unique: true,
    },
    chat_name: {
        type: String,
    },
    isGroupChat: {
        type: Boolean,
        default: false,
    },
    creator: {
        type: Types.UUID,
        ref: 'User',
    },
    members: [
        {
            user_id: {
                type: Types.UUID,
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
        type: String,
        default: '',
    },
    chat_createdAt: {
        type: Date,
        default: Date.now(),
    },
});

export const Chat = model('Chat', chatSchema);
