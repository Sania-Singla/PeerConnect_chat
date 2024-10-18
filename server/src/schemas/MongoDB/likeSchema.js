import { model, Schema } from "mongoose";

const postLikeSchema = new Schema({
    post_id : {
        type: Schema.Types.ObjectId.String,
        ref: "posts",
        required: true,
        index: true
    },
    user_id : {
        type: Schema.Types.ObjectId.String,
        ref: "users",
        required: true,
        index: true
    },
    is_liked: {
        type: Boolean,
        required: true
    }
});

export const Post_like = model("Post_like", [postLikeSchema]); 

const commentLikeSchema = new Schema({
    comment_id : {
        type: Schema.Types.ObjectId.String,
        ref: "comments",
        required: true,
        index: true
    },
    user_id : {
        type: Schema.Types.ObjectId.String,
        ref: "users",
        required: true,
        index: true
    },
    //what if i want to make combo as unique
    is_liked: {
        type: Boolean,
        required: true
    }
})

export const Comment_Like = model("Comment_like", commentLikeSchema)
