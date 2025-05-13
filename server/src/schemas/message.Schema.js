import { Schema, model } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { v4 as uuid } from 'uuid';

const messageSchema = new Schema({
    message_id: {
        type: String,
        unique: true,
        index: true,
        default: () => uuid(),
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
            type: String, // publicId
            ref: 'Attachment',
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

const attachmentSchema = new Schema({
    publicId: {
        type: String,
        unique: true,
        index: true,
        required: true,
    },
    url: {
        type: String,
        unique: true,
        required: true,
    },
    size: { type: Number },
    name: { type: String },
    type: { type: String },
});

// a compound index
messageSchema.index(
    { chat_id: 1, message_createdAt: -1 },
    { name: 'chat_message_createdAt' }
);

messageSchema.plugin(aggregatePaginate);

const Message = new model('Message', messageSchema);
const Attachment = new model('Attachment', attachmentSchema);

export { Message, Attachment };
