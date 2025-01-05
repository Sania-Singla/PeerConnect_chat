import { Imessages } from '../../interfaces/message.Interface.js';
import { Message } from '../../schemas/MongoDB/index.js';

export class MongoMessages extends Imessages {
    async sendMessage(messageId, senderId, recieverId, text, attachment) {
        try {
            const result = await Message.create({
                message_id: messageId,
                sender_id: senderId,
                reciever_id: recieverId,
                text,
                attachment,
            });
            return result.toObject();
        } catch (err) {
            throw err;
        }
    }

    async getMessages(senderId, recieverId) {
        try {
            return await Message.find({
                $or: [
                    { sender_id: senderId, receiver_id: recieverId },
                    { sender_id: recieverId, receiver_id: senderId },
                ],
                message_createdAt: { $lt: lastMessageDate }, // Fetch messages older than the last one
            })
                .sort({ message_createdAt: -1 })
                .limit(50)
                .lean();
        } catch (err) {
            throw err;
        }
    }
}
