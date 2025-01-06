import { Schema, model } from 'mongoose';

const messageSchema = new Schema({
    message_id: {
        type: String,
        required: true,
        unique: true,
    },
    sender_id: {
        type: String,
        ref: 'User',
        required: true,
    },
    receiver_id: {
        type: String,
        ref: 'User',
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
    message_updatedAt: {
        type: Date,
        default: Date.now(),
    },
});

// a compound index
messageSchema.index(
    { sender_id: 1, receiver_id: 1, message_createdAt: -1 },
    { name: 'sender_receiver_createdAt' }
);

export const Message = model('Message', messageSchema);
