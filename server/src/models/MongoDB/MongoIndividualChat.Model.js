import { IindividualChats } from '../../interfaces/individualChat.Interface.js';
import { Message } from '../../schemas/MongoDB/index.js';

export class MongoIndividualChats extends IindividualChats {
    async sendMessage(messageId, senderId, recieverId, text, attachment) {
        try {
        } catch (err) {
            throw err;
        }
    }

    async getMessages(senderId, recieverId) {
        try {
        } catch (err) {
            throw err;
        }
    }
}
