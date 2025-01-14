export class Ichats {
    async chatExistance(chatId) {
        throw new Error('chatExistance method not implemented.');
    }

    async areWeFriends(myId, userIds = []) {
        throw new Error('areWeFriends method not implemented.');
    }

    async createGroup(members, creator, chatName) {
        throw new Error('createGroup method not implemented.');
    }

    async deleteChat(chatId) {
        throw new Error('deleteChat method not implemented.');
    }

    async leaveGroup(chatId, userId) {
        throw new Error('leaveGroup method not implemented.');
    }

    async addMembers(chatId, membersToAdd) {
        throw new Error('addMembers method not implemented.');
    }

    async removeMember(chatId, userId) {
        throw new Error('removeMember method not implemented.');
    }

    async renameGroup(chatId, chatName) {
        throw new Error('renameGroup method not implemented.');
    }

    async getChatDetails(chatId) {
        throw new Error('getChatDetails method not implemented.');
    }

    async getMyChats(myId) {
        throw new Error('getMyChats method not implemented.');
    }

    async getMyGroups(myId) {
        throw new Error('getMyGroups method not implemented.');
    }

    async makeAdmin(chatId, userId) {
        throw new Error('makeAdmin method not implemented.');
    }
}
