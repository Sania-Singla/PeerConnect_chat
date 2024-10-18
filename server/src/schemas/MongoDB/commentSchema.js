import { model, Schema } from "mongoose";

const commentSchema = new Schema({
    comment_id: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    user_id: {
        type: Schema.Types.String,
        ref: "users",
        required: true,
    },
    post_id: {
        type: Schema.Types.String,
        ref: "posts",
        required: true,
    },
    comment_content: {
        type: String,
        required: true
    }
});

export const Comment = model("Comment", commentSchema); 
