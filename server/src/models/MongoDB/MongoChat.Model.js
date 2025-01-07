import { Ichats } from '../../interfaces/chat.Interface.js';
import { Chat, Message } from '../../schemas/MongoDB/index.js';

export class MongoChats extends Ichats {
    async getChat(input) {
        try {
            if (Array.isArray(input)) {
                return await Chat.findOne({
                    participants: input,
                }).lean();
            }
            return await Chat.findOne({ chat_id: input }).lean();
        } catch (err) {
            throw err;
        }
    }

    async updateLastMessage(chatId, message = '') {
        try {
            return await Chat.findOneAndUpdate(
                {
                    chat_id: chatId,
                },
                {
                    $set: {
                        lastMessage: message,
                    },
                },
                {
                    new: true,
                }
            ).lean();
        } catch (err) {
            throw err;
        }
    }

    async addChat(chatId, participants) {
        try {
            const chat = await Chat.create({
                chat_id: chatId,
                participants,
            });
            return chat.toObject();
        } catch (err) {
            throw err;
        }
    }

    async deleteChat(chatId) {
        try {
            return await Chat.findOneAndDelete({ chat_id: chatId }).lean();
        } catch (err) {
            throw err;
        }
    }

    async getChats(myId) {
        try {
            const pipeline = [
                {
                    $match: {
                        participants: myId,
                    },
                },
                {
                    $addFields: {
                        otherParticipant: {
                            $arrayElemAt: [
                                {
                                    $filter: {
                                        input: '$participants',
                                        as: 'participant',
                                        cond: { $ne: ['$$participant', myId] },
                                    },
                                },
                                0,
                            ],
                        },
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'otherParticipant',
                        foreignField: 'user_id',
                        as: 'otherParticipant',
                        pipeline: [
                            {
                                $project: {
                                    user_id: 1,
                                    user_name: 1,
                                    user_firstName: 1,
                                    user_lastName: 1,
                                    user_avatar: 1,
                                },
                            },
                        ],
                    },
                },
                {
                    $unwind: '$otherParticipant',
                },
                {
                    $addFields: {
                        user_id: '$otherParticipant.user_id',
                        user_name: '$otherParticipant.user_name',
                        user_firstName: '$otherParticipant.user_firstName',
                        user_lastName: '$otherParticipant.user_lastName',
                        user_avatar: '$otherParticipant.user_avatar',
                    },
                },
                {
                    $project: {
                        chat_id: 1,
                        chat_createdAt: 1,
                        user_id: 1,
                        user_name: 1,
                        user_firstName: 1,
                        user_lastName: 1,
                        user_avatar: 1,
                    },
                },
            ];
            return await Chat.aggregate(pipeline);
        } catch (err) {
            throw err;
        }
    }
}
