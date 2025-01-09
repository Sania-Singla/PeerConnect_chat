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

    async getMessages(chatId, limit = 50) {
        try {
            // apply pagination later
            return await Message.find({ chat_id: chatId }).lean();
        } catch (err) {
            throw err;
        }
    }
}
