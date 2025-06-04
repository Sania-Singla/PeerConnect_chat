import { Ifollowers } from '../interfaces/follower.Interface.js';
import { Follower } from '../schemas/index.js';

export class MongoDBfollowers extends Ifollowers {
    async getFollowers(channelId) {
        try {
            const pipeline = [
                {
                    $match: {
                        following_id: channelId,
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'follower_id',
                        foreignField: 'user_id',
                        as: 'follower',
                    },
                },
                {
                    $lookup: {
                        from: 'followers',
                        localField: 'follower_id',
                        foreignField: 'following_id',
                        as: 'followers',
                    },
                },
                {
                    $unwind: '$followers',
                    $unwind: '$follower',
                },
                {
                    $addFields: {
                        totalFollowers: {
                            $size: '$followers',
                        },
                        user_id: '$follower.user_id',
                        user_name: '$follower.user_name',
                        user_fullName: '$follower.user_fullName',
                        user_avatar: '$follower.user_avatar',
                    },
                },
                {
                    $project: {
                        follower: 0,
                        followers: 0,
                        follower_id: 0,
                        following_id: 0,
                    },
                },
            ];

            return await Follower.aggregate(pipeline); // return the array itself don't destructure it
        } catch (err) {
            throw err;
        }
    }

    async getFollowings(channelId) {
        try {
            const pipeline = [
                {
                    $match: {
                        follower_id: channelId,
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'following_id',
                        foreignField: 'user_id',
                        as: 'following',
                    },
                },
                {
                    $lookup: {
                        from: 'followers',
                        localField: 'following_id',
                        foreignField: 'following_id',
                        as: 'followers',
                    },
                },
                {
                    $unwind: '$followers',
                    $unwind: '$following',
                },
                {
                    $addFields: {
                        totalFollowers: {
                            $size: '$followers',
                        },
                        user_id: '$following.user_id',
                        user_name: '$following.user_name',
                        user_fullName: '$follower.user_fullName',
                        user_avatar: '$following.user_avatar',
                    },
                },
                {
                    $project: {
                        following: 0,
                        followers: 0,
                        follower_id: 0,
                        following_id: 0,
                    },
                },
            ];
            return await Follower.aggregate(pipeline);
        } catch (err) {
            throw err;
        }
    }

    async toggleFollow(channelId, userId) {
        try {
            const existingRecord = await Follower.findOne({
                following_id: channelId,
                follower_id: userId,
            }); // BSON data

            if (existingRecord) {
                return await existingRecord.deleteOne();
            } else {
                const record = await Follower.create({
                    following_id: channelId,
                    follower_id: userId,
                });
                return record.toObject();
            }
        } catch (err) {
            throw err;
        }
    }
}
