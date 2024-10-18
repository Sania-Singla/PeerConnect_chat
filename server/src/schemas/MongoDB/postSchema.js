import { Schema } from "mongoose";
import {model, schema} from mongoose;

const postSchema= ({
    post_id: {
        type: String,
        unique: true,
        required: true,
        index: true  
    },
    post_image: {
        type: String,
        required: true
    },
    post_title: {
        type: String,
        required: true 
    },
    post_content: {
        type: String,
        required: true,
    },
    post_ownerId: {
        type: Schema.Types.String,
        ref: 'users',//ref not clear
        required: true,
    },
    post_visibilty: {
        type: Boolean,
        default: true,
        required: true
    },
    post_category: {
        type: Schema.Types.String,
        ref: 'categories', //how can we distingush that we are refering id or name
        required: true
    },
    post_createdAt: {
        type: Date,
        default: Date.now(),
        required: true
    },
    post_updatedAt: {
        type: Date,
        default: Date.now(),
        required: true
    }
})

export const Post= model("Post", postSchema)
