import { model, Schema, Types } from 'mongoose';

const followerSchema = new Schema({
    follower_id: {
        type: Types.UUID,
        ref: 'User',
        required: true,
    },
    following_id: {
        type: Types.UUID,
        ref: 'User',
        required: true,
    },
});

export const Follower = model('Follower', followerSchema);
