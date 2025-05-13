import { Imessages } from '../interfaces/message.Interface.js';
import { Chat, Message, Attachment } from '../schemas/index.js';

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
            return await Message.aggregatePaginate(
                [
                    { $match: { chat_id: chatId } },
                    { $sort: { message_createdAt: -1 } },
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
                    { $unwind: '$sender' },
                    {
                        $lookup: {
                            from: 'attachments',
                            localField: 'attachments',
                            foreignField: 'publicId',
                            as: 'attachments',
                        },
                    },
                ],
                { limit, page }
            );
        } catch (err) {
            throw err;
        }
    }

    async sendMessage(chatId, myId, text = '', attachments = []) {
        try {
            const publicIds = attachments.map(({ publicId }) => publicId);
            const time = new Date();
            const lastMessage = {
                message: text || attachments.slice(-1)[0]?.name,
                time,
            };

            const [message, attachmentRecords, updatedChat] = await Promise.all(
                [
                    Message.create({
                        chat_id: chatId,
                        sender_id: myId,
                        text,
                        attachments: publicIds,
                        message_createdAt: time,
                    }),
                    Attachment.insertMany(attachments),
                    this.updateLastMessage(lastMessage, chatId),
                ]
            );

            return message.toObject();
        } catch (err) {
            throw err;
        }
    }

    async updateLastMessage(lastMessage, chatId) {
        try {
            return await Chat.findOneAndUpdate(
                { chat_id: chatId },
                { $set: { lastMessage } },
                { new: true }
            ).lean();
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
