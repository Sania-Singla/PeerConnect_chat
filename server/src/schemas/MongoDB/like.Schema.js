import { model, Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const postLikeSchema = new Schema({
    post_id: {
        type: String,
        ref: 'Post',
        required: true,
        index: true,
    },
    user_id: {
        type: String,
        ref: 'User',
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
        ref: 'Comment',
        required: true,
        index: true,
    },
    user_id: {
        type: String,
        ref: 'User',
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

postLikeSchema.plugin(aggregatePaginate);

const PostLike = new model('PostLike', postLikeSchema);
const CommentLike = new model('CommentLike', commentLikeSchema);

export { PostLike, CommentLike };
