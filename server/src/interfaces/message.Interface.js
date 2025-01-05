export class Imessages {
    async sendMessage(messageId, senderId, recieverId, text, attachment) {
        throw new Error('Method sendMessage is not overwritten.');
    }

    async getMessages(senderId, recieverId) {
        throw new Error('Method sendMessage is not overwritten.');
    }
}
