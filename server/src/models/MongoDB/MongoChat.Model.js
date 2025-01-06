import { Ichats } from '../../interfaces/chat.Interface.js';
import { Chat, Message } from '../../schemas/MongoDB/index.js';

export class MongoChats extends Ichats {
    async addChat(chatId, participants) {
        try {
            const chat = await Chat.create({
                chat_id: chatId,
                participants,
            });
            return chat.toObject();
        } catch (err) {
            console.log(err);
            return res.status(SERVER_ERROR).json({
                message: 'something went wrong while getting the messages.',
                error: err.message,
            });
        }
    }

    async deleteChat(chatId) {
        try {
            return await Chat.findOneAndDelete({ chat_id: chatId }).lean();
        } catch (err) {
            console.log(err);
            return res.status(SERVER_ERROR).json({
                message: 'something went wrong while getting the messages.',
                error: err.message,
            });
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
                            $arrayElementAt: [
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
            console.log(err);
            return res.status(SERVER_ERROR).json({
                message: 'something went wrong while getting the chats.',
                error: err.message,
            });
        }
    }

    async sendMessage(messageId, chatId, myId, text, attachement) {
        try {
            const message = await Message.create({
                message_id: messageId,
                chat_id: chatId,
                senderId: myId,
                text,
                attachement,
            });

            return message.toObject();
        } catch (err) {
            console.log(err);
            return res.status(SERVER_ERROR).json({
                message: 'something went wrong while sending the message.',
                error: err.message,
            });
        }
    }

    async deleteMessage(messageId) {
        try {
            return await Message.findOneAndDelete({
                message_id: messageId,
            }).lean();
        } catch (err) {
            console.log(err);
            return res.status(SERVER_ERROR).json({
                message: 'something went wrong while sending the message.',
                error: err.message,
            });
        }
    }

    async getMessages(chatId, limit = 50) {
        try {
            return await Message.find({ chat_id: chatId }).lean();
        } catch (err) {
            console.log(err);
            return res.status(SERVER_ERROR).json({
                message: 'something went wrong while getting the messages.',
                error: err.message,
            });
        }
    }
}
