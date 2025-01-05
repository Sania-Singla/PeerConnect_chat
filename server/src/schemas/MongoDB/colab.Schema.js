import { Schema, model } from 'mongoose';

const colabSchema = new Schema({
    colab_id: {
        type: String,
        index: true,
        required: true,
    },
    admins: [
        {
            type: String,
            required: true,
            index: true,
        },
    ],
    normalMembers: [
        {
            type: String,
            required: true,
            index: true,
        },
    ],
    colabedOn: {
        type: Date,
        default: Date.now(),
    },
});

export const Colab = model('Colab', colabSchema);
