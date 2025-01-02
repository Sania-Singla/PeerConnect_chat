export class Ifollowers {
    async getFollowers(channelId) {
        throw new Error('Method getFollowers is not overwritten');
    }

    async getFollowings(channelId) {
        throw new Error('Method getFollowing is not overwritten');
    }

    async toggleFollow(channelId, userId) {
        throw new Error('Method toggleFollow is not overwritten');
    }
}
