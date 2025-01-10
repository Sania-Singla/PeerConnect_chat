import { model, Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const postSchema = new Schema({
    post_id: {
        type: String,
        unique: true,
        required: true,
        index: true,
    },
    post_image: {
        type: String,
        required: true,
    },
    post_title: {
        type: String,
        required: true,
    },
    post_content: {
        type: String,
        required: true,
    },
    post_ownerId: {
        type: String,
        ref: 'User',
        required: true,
    },
    post_visibility: {
        type: Boolean,
        default: true,
        required: true,
    },
    post_category: {
        type: String,
        ref: 'Category',
        required: true,
    },
    post_createdAt: {
        type: Date,
        default: Date.now(),
    },
    post_updatedAt: {
        type: Date,
        default: Date.now(),
    },
});

const postViewSchema = new Schema({
    post_id: {
        type: String,
        ref: 'Post',
        required: true,
        index: true,
    },
    user_identifier: {
        type: String,
        ref: 'User',
        required: true,
    },
});

postSchema.plugin(aggregatePaginate);

const Post = model('Post', postSchema);
const PostView = model('PostView', postViewSchema);

export { Post, PostView };
