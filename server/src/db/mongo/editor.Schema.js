import { Schema, model } from 'mongoose';
//for private rooms, a pre-decided member list by owner and all have edit access, and others are not authorized to join
//for public rooms, a user sends a request and owner/admin, if accepts it is stored in db with view access, and if owner leaves , he promotes other member as admin (by chnaging its memberType)
const editorSchema = new Schema({
    roomId: { type: String, required: true },
    ownerId: { type: String, required: true },
    roomType: { type: String, default: 'public' },
    members: [
        {
            memberId: { type: String, required: true },
            accessType: {
                type: String,
                enum: ['view', 'edit'],
                default: 'view',
            },
            memberType: {
                type: String,
                enum: ['owner', 'admin', 'member'],
                default: 'member',
            },
        },
    ],
    code: {
        type: String,
        default: 'we need to add boiler plate code here i guess',
    },
});

export const Editor = model('Editor', editorSchema);
