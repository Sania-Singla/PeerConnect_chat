import { Ifollowers } from '../../interfaces/follower.Interface.js';
import { Follower } from '../../schemas/MongoDB/index.js';

export class MongoDBfollowers extends Ifollowers {
    async getFollowers(channelId) {
        try {
        } catch (err) {
            throw err;
        }
    }

    async getFollowings(channelId) {
        try {
        } catch (err) {
            throw err;
        }
    }

    async toggleFollow(channelId, userId) {
        try {
            const existingRecord = await Follower.findOne({
                following_id: channelId,
                follower_id: userId,
            });

            if (existingRecord) {
                return await existingRecord.deleteOne();
            } else {
                return await Follower.create({
                    following_id: channelId,
                    follower_id: userId,
                });
            }
        } catch (err) {
            throw err;
        }
    }
}
