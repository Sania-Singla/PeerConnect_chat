import { model, Schema } from "mongoose";

const postSchema = new Schema({});

export const Post = model("Post", postSchema); 
