import { Schema, model } from 'mongoose';
import { v4 as uuid } from 'uuid';

const requestSchema = new Schema({
    request_id: {
        type: String,
        required: true,
        index: true,
        unique: true,
        default: () => uuid(),
    },
    sender_id: {
        type: String,
        ref: 'User',
    },
    receiver_id: {
        type: String,
        ref: 'User',
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'rejected', 'accepted'],
    },
});

// TODO: can set a TTL

export const Request = model('Request', requestSchema);
