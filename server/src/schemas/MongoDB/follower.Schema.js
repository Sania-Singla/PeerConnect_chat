import { model, Schema } from 'mongoose';

const followerSchema = new Schema({
    follower_id: {
        type: String,
        ref: 'users',
        required: true,
    },
    following_id: {
        type: String,
        ref: 'users',
        required: true,
    },
});

export const Follower = model('Follower', followerSchema);
