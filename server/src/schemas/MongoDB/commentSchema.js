import { model, Schema } from "mongoose";

const commentSchema = new Schema({});

export const Comment = model("Comment", commentSchema); 
