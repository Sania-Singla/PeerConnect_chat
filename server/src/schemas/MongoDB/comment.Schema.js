import { model, Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

const commentSchema = new Schema({
    comment_id: {
        type: String,
        unique: true,
        required: true,
        default: () => uuid(),
    },
    user_id: {
        type: String,
        ref: 'User',
        required: true,
    },
    post_id: {
        type: String,
        ref: 'Post',
        required: true,
        index: true,
    },
    comment_content: {
        type: String,
        required: true,
    },
    comment_createdAt: {
        type: Date,
        default: Date.now(),
    },
});

export const Comment = new model('Comment', commentSchema);
