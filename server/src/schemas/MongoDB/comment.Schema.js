import { model, Schema, Types } from 'mongoose';

const commentSchema = new Schema({
    comment_id: {
        type: String,
        unique: true,
        required: true,
    },
    user_id: {
        type: Types.UUID,
        ref: 'User',
        required: true,
    },
    post_id: {
        type: Types.UUID,
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

export const Comment = model('Comment', commentSchema);
