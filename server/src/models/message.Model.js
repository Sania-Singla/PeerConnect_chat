import { Imessages } from '../../interfaces/message.Interface.js';
import { Message } from '../../schemas/MongoDB/index.js';

export class MongoMessages extends Imessages {
    async sendMessage(messageId, chatId, myId, text, attachment, fileName) {
        try {
            const message = await Message.create({
                message_id: messageId,
                chat_id: chatId,
                sender_id: myId,
                text,
                attachment,
                fileName,
            });

            return message.toObject();
        } catch (err) {
            throw err;
        }
    }

    async messageExistance(messageId) {
        try {
            return await Message.findOne({ message_id: messageId }).lean();
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

    async getMessages(chatId, limit, page) {
        try {
            return await Message.aggregatePaginate(
                // pipeline
                [
                    {
                        $match: { chat_id: chatId },
                    },
                    {
                        $sort: { message_createdAt: -1 }, // latest first
                    },
                ],
                // options
                {
                    limit,
                    page,
                }
            );
        } catch (err) {
            throw err;
        }
    }
}
