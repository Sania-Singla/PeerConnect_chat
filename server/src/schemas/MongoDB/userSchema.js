import { model, Schema } from "mongoose";

const userSchema = new Schema({
    user_id: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    user_name: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    user_firstName: {
        type: String,
        required: true
    },
    user_lastName: {
        type: String
    },
    user_bio: {
        type: String,
        default: ''
    },
    user_avatar: {
        type: String,
        required: true
    },
    user_coverImage: {
        type: String,
        required: true
    },
    user_email: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    user_password: {
        type: String,
        required: true,
    },
    user_createdAt: {
        type: Date, //check
        default: Date.now(),
        required: true
    },
    refresh_token: {
        type: String,
        default: ''
    }
});

export const User = model("User", userSchema); 
