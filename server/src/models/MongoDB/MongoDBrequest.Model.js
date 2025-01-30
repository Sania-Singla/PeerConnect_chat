import { Irequests } from '../../interfaces/request.Interface.js';
import { Chat, Request } from '../../schemas/MongoDB/index.js';
/* import { chatObject } from '../../controllers/chat.Controller.js'; 
   - causes circular dependency ERROR
    getServiceObject --imports-> models --imports-> controller 
   |                                                          |
    <------------------------imports--------------------------
*/

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
            return await Request.findOne({
                sender_id: myId,
                receiver_id: userId,
            }).lean();
        } catch (err) {
            throw err;
        }
    }

    // ! not in use right now
    // Instead of importing chatObject directly at the top, import it only when needed to avoid circular dep. error
    async areWeFriends(myId, userIds = []) {
        const { chatObject } = await import(
            '../../controllers/chat.Controller.js'
        ); // Lazy import
        return chatObject.areWeFriends(myId, userIds);
    }

    async sendRequest(myId, userId) {
        const request = await Request.findOne({
            $or: [
                { sender_id: myId, receiver_id: userId },
                { sender_id: userId, receiver_id: myId },
            ],
        });

        if (request) {
            switch (request.status) {
                case 'pending': {
                    if (request.sender_id === myId) {
                        return 'you have already sent a collaboration request to this user';
                    }
                    return 'you already have a collaboration request from this user';
                }
                case 'accepted': {
                    return 'you have already collaborated with this user';
                }
                case 'rejected': {
                    await request.remove();
                    const newRequest = await Request.create({
                        sender_id: myId,
                        receiver_id: userId,
                    });
                    return newRequest.toObject();
                }
                default: {
                    break;
                }
            }
        }

        const newRequest = await Request.create({
            sender_id: myId,
            receiver_id: userId,
        });

        return newRequest.toObject();
    }

    async rejectRequest(requestId) {
        try {
            return await Request.findOneAndUpdate(
                { request_id: requestId },
                { $set: { status: 'rejected' } },
                { new: true }
            ).lean();
        } catch (err) {
            throw err;
        }
    }

    async acceptRequest(requestId) {
        try {
            const request = await Request.findOneAndUpdate(
                { request_id: requestId },
                { $set: { status: 'accepted' } },
                { new: true }
            ).lean();

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

    async getMyRequests(myId, status) {
        try {
            return await Request.aggregate([
                {
                    $match: {
                        receiver_id: myId,
                    },
                },
                { $match: status ? { status } : {} },
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
                {
                    $unwind: '$sender',
                },
                {
                    $project: {
                        receiver_id: 0,
                        sender_id: 0,
                    },
                },
            ]);
        } catch (err) {
            throw err;
        }
    }
}
