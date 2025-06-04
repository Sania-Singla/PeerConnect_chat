export class Iusers {
    async getUser(searchInput) {
        throw new Error('Method getUser not overwritten.');
    }

    async createUser(userId, userName, fullName, avatar, email, password) {
        throw new Error('Method createUser not overwritten.');
    }

    async deleteUser(userId) {
        throw new Error('Method deleteUser not overwritten.');
    }

    async logoutUser(userId) {
        throw new Error('Method logoutUser not overwritten.');
    }

    async loginUser(userId, refreshToken) {
        throw new Error('Method updateTokens not overwritten.');
    }

    async getChannelProfile(channelId, userId) {
        throw new Error('Method getChannelProfile not overwritten.');
    }

    async updateAccountDetails({ userId, firstName, lastName, email }) {
        throw new Error('Method updateAccountDetails not overwritten.');
    }

    async updateChannelDetails({ userId, userName, bio }) {
        throw new Error('Method updateChannelDetails not overwritten.');
    }

    async updatePassword(userId, newPassword) {
        throw new Error('Method updatePassword not overwritten.');
    }

    async updateAvatar(userId, avatar) {
        throw new Error('Method updateAvatar not overwritten.');
    }

    async updateCoverImage(userId, coverImage) {
        throw new Error('Method updateCoverImage not overwritten.');
    }

    async getWatchHistory(userId, orderBy, limit, page) {
        throw new Error('Method getWatchHistory is not overwritten.');
    }

    async clearWatchHistory(userId) {
        throw new Error('Method clearWatchHistory is not overwritten.');
    }

    async updateWatchHistory(postId, userId) {
        throw new Error('Method updateWatchHistory is not overwritten.');
    }
}
