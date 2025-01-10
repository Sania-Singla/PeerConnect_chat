import { Schema, model } from 'mongoose';

const groupChatSchema = new Schema({
    group_id: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    group_name: {
        type: String,
        required: true,
    },
    created_by: {
        type: String,
        ref: 'User',
        required: true,
    },
    group_createdAt: {
        type: Date,
        default: Date.now(),
    },
});

const groupParticipantSchema = new Schema({
    group_id: {
        type: String,
        ref: 'GroupChat',
        required: true,
        index: true,
    },
    user_id: {
        type: String,
        ref: 'User',
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'member'],
        default: 'member',
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    addedAt: {
        type: Date,
        default: Date.now(),
    },
});

const groupMessageSchema = new Schema({
    group_id: {
        type: String,
        ref: 'GroupChat',
        required: true,
    },
    sender_id: {
        type: String,
        ref: 'GroupParticipant',
        required: true,
    },
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
});

export const GroupChat = model('GroupChat', groupChatSchema);
export const GroupMessage = model('GroupMessage', groupMessageSchema);
export const GroupParticipant = model(
    'GroupParticipant',
    groupParticipantSchema
);
