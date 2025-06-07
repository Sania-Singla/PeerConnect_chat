import { Schema, model } from 'mongoose';

const textEditorSchema = new Schema({
    roomId: { type: String, required: true },
    code: { type: String, default: '' },
});

export const TextEditor = model('TextEditor', textEditorSchema);
