import { Schema, model } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { v4 as uuid } from 'uuid';

const messageSchema = new Schema({
    message_id: {
        type: String,
        required: true,
        unique: true,
        default: uuid(),
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
    },
    text: {
        type: String,
        default: '',
    },
    attachments: [
        {
            type: String,
        },
    ],
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

messageSchema.plugin(aggregatePaginate);

export const Message = model('Message', messageSchema);
