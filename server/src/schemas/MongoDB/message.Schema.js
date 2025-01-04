import { Schema, model } from 'mongoose';

const messageSchema = new Schema({});

export const Message = model('Message', messageSchema);
