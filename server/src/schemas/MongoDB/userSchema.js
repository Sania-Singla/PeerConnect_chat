import { model, Schema } from "mongoose";

const userSchema = new Schema({});

export const User = model("User", userSchema); 
