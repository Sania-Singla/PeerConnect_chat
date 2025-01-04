import { model, Schema } from 'mongoose';

const categorySchema = new Schema({
    category_id: {
        type: String,
        required: true,
        unique: true,
    },
    category_name: {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
});

export const Category = model('Category', categorySchema); // categories
