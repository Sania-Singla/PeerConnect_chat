import { model, Schema } from 'mongoose';

const followerSchema = new Schema({
    follower_id: {
        type: String,
        ref: 'User',
        required: true,
    },
    following_id: {
        type: String,
        ref: 'User',
        required: true,
    },
});

export const Follower = new model('Follower', followerSchema);
