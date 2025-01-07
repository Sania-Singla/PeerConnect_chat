import { Schema, model } from 'mongoose';

const onlineUserSchema = new Schema({
    user_id: { type: String, ref: 'User', required: true },
    socket_id: { type: String, default: '' },
    is_online: { type: Boolean, default: false }, // for ease although we can use socket_id being '' or not
    last_seen: { type: Date, default: null },
});

export const OnlineUser = model('OnlineUser', onlineUserSchema);
