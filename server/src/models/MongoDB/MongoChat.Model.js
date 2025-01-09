import { Ichats } from '../../interfaces/chat.Interface.js';
import { Chat } from '../../schemas/MongoDB/index.js';

export class MongoChats extends Ichats {
    async doesChatAlreadyExist(participants) {
        try {
            return await Chat.findOne({
                participants,
            }).lean();
        } catch (err) {
            throw err;
        }
    }

    async chatExistance(chatId) {
        try {
            return await Chat.findOne({ chat_id: chatId }).lean();
        } catch (err) {
            throw err;
        }
    }

    async getChat(chatId, myId) {
        try {
            if (myId) {
                const pipeline = [
                    {
                        $match: { chat_id: chatId },
                    },
                    // populate only other user
                    {
                        $addFields: {
                            otherUserId: {
                                $arrayElemAt: [
                                    {
                                        $filter: {
                                            input: '$participants',
                                            as: 'participant',
                                            cond: {
                                                $ne: ['$$participant', myId],
                                            },
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
                            localField: 'otherUserId',
                            foreignField: 'user_id',
                            as: 'otherUser',
                            pipeline: [
                                {
                                    $project: {
                                        user_id: 1,
                                        user_name: 1,
                                        user_avatar: 1,
                                        user_firstName: 1,
                                        user_lastName: 1,
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $unwind: '$otherUser',
                    },
                    {
                        $addFields: {
                            user_id: '$otherUser.user_id',
                            user_name: '$otherUser.user_name',
                            user_avatar: '$otherUser.user_avatar',
                            user_firstName: '$otherUser.user_firstName',
                            user_lastName: '$otherUser.user_lastName',
                        },
                    },
                    {
                        $project: {
                            participants: 0,
                            otherUser: 0,
                            otherUserId: 0,
                        },
                    },
                ];

                const result = await Chat.aggregate(pipeline);
                return result.length ? result[0] : null;
            } else {
                return await Chat.findOne({ chat_id: chatId }).lean();
            }
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
                        otherParticipant: 0,
                        participants: 0,
                    },
                },
            ];
            return await Chat.aggregate(pipeline);
        } catch (err) {
            throw err;
        }
    }
}
