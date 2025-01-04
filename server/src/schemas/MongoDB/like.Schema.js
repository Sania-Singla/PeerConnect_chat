import { model, Schema } from 'mongoose';

const postLikeSchema = new Schema({
    post_id: {
        type: String,
        ref: 'posts',
        required: true,
        index: true,
    },
    user_id: {
        type: String,
        ref: 'users',
        required: true,
        index: true,
    },
    is_liked: {
        type: Boolean,
        required: true,
    },
    likedAt: {
        type: Date,
        default: Date.now(),
    },
});

const commentLikeSchema = new Schema({
    comment_id: {
        type: String,
        ref: 'comments',
        required: true,
        index: true,
    },
    user_id: {
        type: String,
        ref: 'users',
        required: true,
    },
    is_liked: {
        type: Boolean,
        required: true,
    },
    likedAt: {
        type: Date,
        default: Date.now(),
    },
});

const PostLike = model('PostLike', postLikeSchema);
const CommentLike = model('CommentLike', commentLikeSchema);

export { PostLike, CommentLike };
