export class Ichats {
    async getChat(input) {
        throw new Error('Method getChat is not overwritten');
    }

    async updateLastMessage(chatId, message = '') {
        throw new Error('Method updateLastMessage is not overwritten');
    }

    async addChat(chatId, participants) {
        throw new Error('Method addChat is not overwritten');
    }

    async deleteChat(chatId) {
        throw new Error('Method deleteChat is not overwritten');
    }

    async getChats(myId) {
        throw new Error('Method getChats is not overwritten');
    }
}
