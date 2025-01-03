import { Ifollowers } from '../../interfaces/follower.Interface.js';
import { Follower } from '../../schemas/MongoDB/index.js';

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
                        foriegnField: 'user_id',
                        as: 'follower',
                        pipeline: [
                            {
                                $lookup: {
                                    from: 'followers',
                                    localField: 'user_id',
                                    foriegnField: 'following_id',
                                    as: 'followers',
                                },
                            },
                            {
                                $addFields: {
                                    totalFollowers: {
                                        $size: '$followers',
                                    },
                                },
                            },
                        ],
                    },
                },
                {
                    $addFields: {
                        user_id: '$follower.user_id',
                        user_name: '$follower.user_name',
                        user_firstName: '$follower.user_firstName',
                        user_lastName: '$follower.user_lastName',
                        user_avatar: '$follower.user_avatar',
                        totalFollowers: '$follower.totalFollowers',
                    },
                },
                {
                    $project: {
                        user_id: 1,
                        user_name: 1,
                        user_firstName: 1,
                        user_lastName: 1,
                        user_avatar: 1,
                        totalFollowers: 1,
                        follower_id: 0,
                        following_id: 0,
                        follower: 0,
                    },
                },
            ];
            return await Follower.aggregate(pipeline);
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
                        foriegnField: 'user_id',
                        as: 'following',
                        pipeline: [
                            {
                                $lookup: {
                                    from: 'followers',
                                    localField: 'user_id',
                                    foriegnField: 'following_id',
                                    as: 'followers',
                                },
                            },
                            {
                                $addFields: {
                                    totalFollowers: {
                                        $size: '$followers',
                                    },
                                },
                            },
                        ],
                    },
                },
                {
                    $addFields: {
                        user_id: '$following.user_id',
                        user_name: '$following.user_name',
                        user_firstName: '$following.user_firstName',
                        user_lastName: '$following.user_lastName',
                        user_avatar: '$following.user_avatar',
                        totalFollowers: '$following.totalFollowers',
                    },
                },
                {
                    $project: {
                        user_id: 1,
                        user_name: 1,
                        user_firstName: 1,
                        user_lastName: 1,
                        user_avatar: 1,
                        totalFollowers: 1,
                        follower_id: 0,
                        following_id: 0,
                        following: 0,
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
