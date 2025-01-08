import { Imessages } from '../../interfaces/message.Interface.js';
import { Message } from '../../schemas/MongoDB/index.js';

export class MongoMessages extends Imessages {
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
            // apply pagination later
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
