import { Imessages } from '../../interfaces/message.Interface.js';
import { Message } from '../../schemas/MongoDB/index.js';

export class MongoDBmessages extends Imessages {
    async messageExistance(messageId) {
        try {
            return await Message.findOne({ message_id: messageId }).lean();
        } catch (err) {
            throw err;
        }
    }

    async getMessages(chatId, limit, page) {
        try {
            // todo: populate the sender
            return await Message.aggregatePaginate(
                // pipeline
                [
                    { $match: { chat_id: chatId } },
                    {
                        $sort: { message_createdAt: -1 }, // latest first
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'sender_id',
                            foreignField: 'user_id',
                            as: 'sender',
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
                        $unwind: '$sender',
                    }
                ],
                // options
                { limit, page }
            );
        } catch (err) {
            throw err;
        }
    }

    async sendMessage(chatId, myId, { text, attachments = [] }) {
        try {
            const message = await Message.create({
                chat_id: chatId,
                sender_id: myId,
                text,
                attachments,
            });
            return message.toObject();
        } catch (err) {
            throw err;
        }
    }

    async editMessage(messageId, newText) {
        try {
            return await Message.findOneAndUpdate({
                message_id: messageId,
                text: newText,
            }).lean();
        } catch (err) {
            throw err;
        }
    }

    async deleteMessage(messageId) {
        try {
            return await Message.findOneAndDelete({
                message_id: messageId,
            }).lean();
        } catch (err) {
            throw err;
        }
    }
}
