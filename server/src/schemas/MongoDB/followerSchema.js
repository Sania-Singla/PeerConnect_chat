import { model, Schema } from "mongoose";

const followerSchema = new Schema({});

export const Follower = model("Follower", followerSchema); 
