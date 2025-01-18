import { Iusers } from '../../interfaces/user.Interface.js';
import { User, WatchHistory } from '../../schemas/MongoDB/index.js';
import { getPipeline2 } from '../../helpers/index.js';

export class MongoDBusers extends Iusers {
    async getUser(searchInput) {
        try {
            if (typeof searchInput === 'object' && searchInput !== null) {
                return await User.findOne({
                    $or: [
                        { user_name: searchInput.userName },
                        { user_email: searchInput.email },
                    ],
                }).lean();
            }
            return await User.findOne({
                $or: [
                    { user_id: searchInput },
                    { user_name: searchInput },
                    { user_email: searchInput },
                ],
            }).lean();
        } catch (err) {
            throw err;
        }
    }

    async userExistance(userId) {
        try {
            return await User.findOne({ user_id: userId }).lean();
        } catch (err) {
            throw err;
        }
    }

    async createUser({
        userName,
        firstName,
        lastName,
        avatar,
        coverImage,
        email,
        password,
    }) {
        try {
            const user = await User.create({
                user_name: userName,
                user_firstName: firstName,
                user_lastName: lastName,
                user_avatar: avatar,
                user_coverImage: coverImage,
                user_email: email,
                user_password: password,
            });

            const { refresh_token, user_password, ...createdUser } =
                user.toObject(); // BSON -> JS obj

            return createdUser;
        } catch (err) {
            throw err;
        }
    }

    async deleteUser(userId) {
        try {
            return await User.findOneAndDelete({
                user_id: userId,
            })
                .select('-refresh_token -user_password')
                .lean();
        } catch (err) {
            throw err;
        }
    }

    async logoutUser(userId) {
        try {
            return await User.findOneAndUpdate(
                { user_id: userId },
                {
                    $set: {
                        refresh_token: '',
                    },
                },
                {
                    new: true,
                }
            )
                .select('-refresh_token -user_password')
                .lean();
        } catch (err) {
            throw err;
        }
    }

    async loginUser(userId, refreshToken) {
        try {
            return await User.findOneAndUpdate(
                { user_id: userId },
                {
                    $set: {
                        refresh_token: refreshToken,
                    },
                },
                {
                    new: true,
                }
            )
                .select('-refresh_token -user_password')
                .lean();
        } catch (err) {
            throw err;
        }
    }

    async getChannelProfile(channelId, userId) {
        try {
            const pipeline = [
                {
                    $match: {
                        user_id: channelId,
                    },
                },
                // followers[]
                {
                    $lookup: {
                        from: 'followers',
                        localField: 'user_id',
                        foreignField: 'following_id',
                        as: 'followers',
                    },
                },
                // followings[]   // TODO: optimize into single join using filter after ward
                {
                    $lookup: {
                        from: 'followers',
                        localField: 'user_id',
                        foreignField: 'follower_id',
                        as: 'followings',
                    },
                },
                // posts[ { ..., post_likes:[], post_views:[] } ]
                {
                    $lookup: {
                        from: 'posts',
                        localField: 'user_id',
                        foreignField: 'post_ownerId',
                        as: 'posts',
                        pipeline: [
                            {
                                $lookup: {
                                    from: 'postlikes',
                                    localField: 'post_id',
                                    foreignField: 'post_id',
                                    as: 'post_likes',
                                    pipeline: [
                                        {
                                            $match: {
                                                is_liked: true,
                                            },
                                        },
                                    ],
                                },
                            },
                            {
                                $lookup: {
                                    from: 'postviews',
                                    localField: 'post_id',
                                    foreignField: 'post_id',
                                    as: 'post_views',
                                },
                            },
                        ],
                    },
                },
                {
                    $addFields: {
                        isFollowed:
                            channelId !== userId
                                ? {
                                      $in: [
                                          userId,
                                          {
                                              $map: {
                                                  input: '$followers',
                                                  as: 'follower',
                                                  in: '$$follower.follower_id',
                                              },
                                          },
                                      ],
                                  }
                                : false,
                        totalPosts: { $size: '$posts' },
                        totalFollowers: { $size: '$followers' },
                        totalFollowings: { $size: '$followings' },
                        totalLikes: {
                            $sum: {
                                $map: {
                                    input: '$posts',
                                    as: 'post',
                                    in: {
                                        $size: '$$post.post_likes',
                                    },
                                },
                            },
                        },
                        totalChannelViews: {
                            $sum: {
                                $map: {
                                    input: '$posts',
                                    as: 'post',
                                    in: {
                                        $size: '$$post.post_views',
                                    },
                                },
                            },
                        },
                    },
                },
                {
                    $project: {
                        // we can only mention 0's or 1's others will be opp. by default can't mix
                        user_password: 0,
                        refresh_token: 0,
                        followers: 0,
                        followings: 0,
                        posts: 0,
                    },
                },
            ];
            const [profile] = await User.aggregate(pipeline);
            return profile;
        } catch (err) {
            throw err;
        }
    }

    async updateAccountDetails({ userId, firstName, lastName, email }) {
        try {
            return await User.findOneAndUpdate(
                { user_id: userId },
                {
                    $set: {
                        user_firstName: firstName,
                        user_lastName: lastName,
                        user_email: email,
                    },
                },
                {
                    new: true,
                }
            )
                .select('-user_password -refresh_token')
                .lean();
        } catch (err) {
            throw err;
        }
    }

    async updateChannelDetails({ userId, userName, bio }) {
        try {
            return await User.findOneAndUpdate(
                { user_id: userId },
                {
                    $set: {
                        user_name: userName,
                        user_bio: bio,
                    },
                },
                {
                    new: true,
                }
            )
                .select('-user_password -refresh_token')
                .lean();
        } catch (err) {
            throw err;
        }
    }

    async updatePassword(userId, newPassword) {
        try {
            return await User.findOneAndUpdate(
                { user_id: userId },
                {
                    $set: {
                        user_password: newPassword,
                    },
                },
                {
                    new: true,
                }
            )
                .select('-user_password -refresh_token')
                .lean();
        } catch (err) {
            throw err;
        }
    }

    async updateAvatar(userId, avatar) {
        try {
            return await User.findOneAndUpdate(
                { user_id: userId },
                {
                    $set: {
                        user_avatar: avatar,
                    },
                },
                {
                    new: true,
                }
            )
                .select('-user_password -refresh_token')
                .lean();
        } catch (err) {
            throw err;
        }
    }

    async updateCoverImage(userId, coverImage) {
        try {
            return await User.findOneAndUpdate(
                { user_id: userId },
                {
                    $set: {
                        user_coverImage: coverImage,
                    },
                },
                {
                    new: true,
                }
            )
                .select('-user_password -refresh_token')
                .lean();
        } catch (err) {
            throw err;
        }
    }

    async getWatchHistory(userId, orderBy, limit, page) {
        try {
            const pipeline2 = getPipeline2(orderBy, 'watchedAt');
            const pipeline = [
                {
                    $match: {
                        user_id: userId,
                    },
                },
                ...pipeline2,
            ];
            return await WatchHistory.aggregatePaginate(pipeline, {
                page,
                limit,
            });
        } catch (err) {
            throw err;
        }
    }

    async clearWatchHistory(userId) {
        try {
            return await WatchHistory.deleteMany({
                user_id: userId,
            });
        } catch (err) {
            throw err;
        }
    }

    async updateWatchHistory(postId, userId) {
        try {
            return await WatchHistory.findOneAndUpdate(
                {
                    post_id: postId,
                    user_id: userId,
                },
                {
                    $setOnInsert: {
                        post_id: postId,
                        user_id: userId,
                    },
                    $set: {
                        watchedAt: new Date(),
                    },
                },
                {
                    upsert: true,
                }
            );
        } catch (err) {
            throw err;
        }
    }
}
