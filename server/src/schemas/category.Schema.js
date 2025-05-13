import { model, Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

const categorySchema = new Schema({
    category_id: {
        type: String,
        required: true,
        unique: true,
        default: () => uuid(),
    },
    category_name: {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
});

export const Category = new model('Category', categorySchema); // categories
