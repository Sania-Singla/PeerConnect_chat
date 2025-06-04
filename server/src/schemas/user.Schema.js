import { model, Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { v4 as uuid } from 'uuid';

const userSchema = new Schema({
    user_id: {
        type: String,
        default: () => uuid(),
        unique: true,
        required: true,
        index: true,
    },
    user_name: {
        type: String,
        unique: true,
        required: true,
        index: true,
    },
    user_fullName: {
        type: String,
        required: true,
    },
    user_bio: {
        type: String,
        default: '',
    },
    user_avatar: {
        type: String,
        required: false,
    },
    user_coverImage: {
        type: String,
        default: '',
    },
    user_email: {
        type: String,
        unique: true,
        required: true,
    },
    user_password: {
        type: String,
        required: function () {
            return this.auth_provider === 'local'; // password required only for local
        },
    },
    auth_provider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local',
    },
    user_createdAt: {
        type: Date,
        default: Date.now(),
    },
    refresh_token: {
        type: String,
        default: '',
    },
});

const savedPostSchema = new Schema({
    post_id: {
        type: String,
        required: true,
        ref: 'Post',
    },
    user_id: {
        type: String,
        required: true,
        ref: 'User',
        index: true,
    },
    savedAt: {
        type: Date,
        default: Date.now(),
    },
});

const watchHistorySchema = new Schema({
    post_id: {
        type: String,
        required: true,
        ref: 'Post',
    },
    user_id: {
        type: String,
        required: true,
        ref: 'User',
        index: true,
    },
    watchedAt: {
        type: Date,
        default: Date.now(),
    },
});

userSchema.plugin(aggregatePaginate);
savedPostSchema.plugin(aggregatePaginate);
watchHistorySchema.plugin(aggregatePaginate);

const User = new model('User', userSchema);
const SavedPost = new model('SavedPost', savedPostSchema);
const WatchHistory = new model('WatchHistory', watchHistorySchema);

export { User, SavedPost, WatchHistory };
