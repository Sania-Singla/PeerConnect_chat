import { Irequests } from '../interfaces/request.Interface.js';
import { Chat, Request } from '../schemas/index.js';

export class MongoDBrequests extends Irequests {
    async requestExistance(requestId) {
        try {
            return await Request.findOne({ request_id: requestId }).lean();
        } catch (err) {
            throw err;
        }
    }

    async getRequest(userId, myId) {
        try {
            const [request, chat] = await Promise.all([
                Request.findOne({
                    $or: [
                        { sender_id: myId, receiver_id: userId },
                        { sender_id: userId, receiver_id: myId },
                    ],
                }),
                Chat.findOne({
                    members: {
                        $all: [
                            { $elemMatch: { user_id: myId } },
                            { $elemMatch: { user_id: userId } },
                        ],
                    },
                    isGroupChat: false,
                }),
            ]);

            if (request) return { ...request.toObject(), isRequest: true };
            if (chat) return { ...chat.toObject(), isRequest: false };

            return null; // No request or chat found
        } catch (err) {
            throw err;
        }
    }

    async sendRequest(myId, userId) {
        const [request, chat] = await Promise.all([
            Request.findOne({
                $or: [
                    { sender_id: myId, receiver_id: userId },
                    { sender_id: userId, receiver_id: myId },
                ],
            }),
            Chat.findOne({
                members: {
                    $all: [
                        { $elemMatch: { user_id: myId } },
                        { $elemMatch: { user_id: userId } },
                    ],
                },
                isGroupChat: false,
            }),
        ]);

        if (request) {
            if (request.receiverId === myId) {
                // accept request
                Chat.create({
                    members: [
                        { user_id: myId, role: 'member' },
                        { user_id: userId, role: 'member' },
                    ],
                });
                return chat.toObject();
            }
            return 'Collaboration request already sent';
        }
        if (chat) {
            return 'You are already friends with this user';
        }

        const newRequest = await Request.create({
            sender_id: myId,
            receiver_id: userId,
        });

        return newRequest.toObject();
    }

    async rejectRequest(requestId) {
        try {
            return await Request.findOneAndDelete({
                request_id: requestId,
            }).lean();
        } catch (err) {
            throw err;
        }
    }

    async acceptRequest(requestId) {
        try {
            const request = await Request.findOneAndDelete({
                request_id: requestId,
            }).lean();

            const chat = await Chat.create({
                creator: request.sender_id,
                members: [
                    { user_id: request.sender_id, role: 'member' },
                    { user_id: request.receiver_id, role: 'member' },
                ],
            });
            return chat.toObject();
        } catch (err) {
            throw err;
        }
    }

    async getMyRequests(myId) {
        try {
            return await Request.aggregate([
                { $match: { receiver_id: myId } },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'sender_id',
                        foreignField: 'user_id',
                        as: 'sender',
                        pipeline: [
                            {
                                $project: {
                                    user_name: 1,
                                    user_lastName: 1,
                                    user_firstName: 1,
                                    user_avatar: 1,
                                },
                            },
                        ],
                    },
                },
                { $unwind: '$sender' },
            ]);
        } catch (err) {
            throw err;
        }
    }
}
