import { model, Schema } from "mongoose";

const followerSchema = new Schema({
    follower_id: {
        type: Schema.Types.String,
        ref: "users",
        required: true,
        index: true
    },
    following_id: {
        type: Schema.Types.String,
        ref: "users",
        required: true,
        index: true
    }
});

export const Follower = model("Follower", followerSchema); 
