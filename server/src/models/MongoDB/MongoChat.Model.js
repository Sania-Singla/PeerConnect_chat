import { Ichats } from '../../interfaces/chat.Interface.js';
import { Chat, Request } from '../../schemas/MongoDB/index.js';

export class MongoChats extends Ichats {
    async chatExistance(chatId) {
        try {
            return await Chat.findOne({ chat_id: chatId }).lean();
        } catch (err) {
            throw err;
        }
    }

    async requestExistance(requestId) {
        try {
            return await Request.findOne({ request_id: requestId }).lean();
        } catch (err) {
            throw err;
        }
    }

    async createGroup(members, creator, chatName) {
        const groupChat = await Chat.create({
            creator,
            members,
            chat_name: chatName,
        });

        return groupChat.toObject();
    }

    async deleteChat(chatId) {
        return await Chat.findOneAndDelete({ chat_id: chatId }).lean();
    }

    async leaveGroup(chatId, memberLeaving) {
        const chat = await Chat.findOneAndUpdate(
            {
                chat_id: chatId,
            },
            {
                $pull: {
                    members: { user_id: memberLeaving },
                },
            },
            {
                new: true,
            }
        );

        const hasAdmin = chat.members.some(({ role }) => role === 'admin');

        if (!hasAdmin) {
            chat.members[0].role = 'admin';
        }

        await chat.save();
        return chat.toObject();
    }

    async sendRequest(senderId, receiverId) {
        const [request, chat] = await Promise.all([
            Request.findOne({
                $or: [
                    { sender_id: senderId, receiver_id: receiverId },
                    { sender_id: receiverId, receiver_id: senderId },
                ],
                status: 'pending',
            }),
            Chat.findOne({
                isGroupChat: false,
                members: [senderId, receiverId],
            }),
        ]);

        if (request) {
            return 'request already exists';
        }

        if (chat) {
            return 'chat already exists';
        }

        const newRequest = await Request.create({
            sender_id: senderId,
            receiver_id: receiverId,
        });

        return newRequest.toObject();
    }

    async rejectRequest(requestId) {
        try {
            return await Request.findOneAndUpdate(
                {
                    request_id: requestId,
                },
                {
                    $set: {
                        status: 'rejected',
                    },
                },
                { new: true }
            ).lean();
        } catch (err) {
            throw err;
        }
    }

    async acceptRequest(requestId) {
        try {
            const request = await Request.findOneAndUpdate(
                {
                    request_id: requestId,
                },
                {
                    $set: {
                        status: 'accepted',
                    },
                },
                { new: true }
            ).lean();

            const chat = await Chat.create({
                creator: request.sender_id,
                members: [request.sender_id, request.receiver_id],
            });
            return chat.toObject();
        } catch (err) {
            throw err;
        }
    }

    async addMembers(chatId, newMembers) {
        try {
        } catch (err) {
            throw err;
        }
    }

    async removeMember(chatId, memberId) {
        try {
        } catch (err) {
            throw err;
        }
    }

    async renameGroup(chatId, newName) {
        try {
        } catch (err) {
            throw err;
        }
    }

    async getGroupDetails(chatId) {
        try {
        } catch (err) {
            throw err;
        }
    }

    async getMyGroups(myId) {
        try {
        } catch (err) {
            throw err;
        }
    }

    async getMyChats(myId) {
        try {
        } catch (err) {
            throw err;
        }
    }
}
