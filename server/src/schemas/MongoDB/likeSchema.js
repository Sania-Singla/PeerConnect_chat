import { model, Schema } from "mongoose";

const likeSchema = new Schema({});

export const Like = model("Like", likeSchema); 
