import { Iusers } from '../interfaces/user.Interface.js';
import { User, WatchHistory } from '../schemas/index.js';
import { getPipeline1 } from '../helpers/index.js';

export class MongoDBusers extends Iusers {
    async getUser(searchInput) {
        try {
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
        fullName,
        avatar,
        email,
        password,
        authProvider,
    }) {
        try {
            const user = await User.create({
                user_name: userName,
                user_fullName: fullName,
                user_avatar: avatar,
                user_email: email,
                user_password: password,
                auth_provider: authProvider,
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
                { $set: { refresh_token: '' } },
                { new: true }
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
                { $set: { refresh_token: refreshToken } },
                { new: true }
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
                { $match: { user_id: channelId } },
                {
                    $lookup: {
                        from: 'followers',
                        localField: 'user_id',
                        foreignField: 'following_id',
                        as: 'followers',
                    },
                },
                {
                    $lookup: {
                        from: 'posts',
                        localField: 'user_id',
                        foreignField: 'post_ownerId',
                        as: 'posts',
                        pipeline: [
                            {
                                $lookup: {
                                    from: 'postviews',
                                    localField: 'post_id',
                                    foreignField: 'post_id',
                                    as: 'views',
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
                        totalViews: {
                            $sum: {
                                $map: {
                                    input: '$posts',
                                    as: 'post',
                                    in: { $size: '$$post.views' },
                                },
                            },
                        },
                    },
                },
                {
                    $project: {
                        user_password: 0,
                        refresh_token: 0,
                        followers: 0,
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

    async updateAccountDetails({ userId, fullName, email }) {
        try {
            return await User.findOneAndUpdate(
                { user_id: userId },
                {
                    $set: {
                        user_fullName: fullName,
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
            const pipeline1 = getPipeline1(orderBy, 'watchedAt');
            const pipeline = [{ $match: { user_id: userId } }, ...pipeline1];

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

    async getAdminStats(userId) {
        const pipeline = [
            { $match: { user_id: userId } },
            // followers[]
            {
                $lookup: {
                    from: 'followers',
                    localField: 'user_id',
                    foreignField: 'following_id',
                    as: 'followers',
                },
            },
            // posts[ { post_views[], post_likes[] } ]
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
                        {
                            $lookup: {
                                from: 'comments',
                                localField: 'post_id',
                                foreignField: 'post_id',
                                as: 'post_comments',
                            },
                        },
                        {
                            $addFields: {
                                likes: {
                                    $size: {
                                        $filter: {
                                            input: '$post_likes',
                                            as: 'like',
                                            cond: '$$like.is_liked',
                                        },
                                    },
                                },
                                dislikes: {
                                    $size: {
                                        $filter: {
                                            input: '$post_likes',
                                            as: 'like',
                                            cond: { $not: '$$like.is_liked' },
                                        },
                                    },
                                },
                                views: { $size: '$post_views' },
                                comments: { $size: '$post_comments' },
                            },
                        },
                    ],
                },
            },
            // comments[]
            {
                $lookup: {
                    from: 'comments',
                    pipeline: [
                        { $match: { user_id: userId } },
                        { $count: 'total' },
                    ],
                    as: 'comments',
                },
            },
            {
                $addFields: {
                    comments: { $arrayElemAt: ['$comments.total', 0] },
                    views: {
                        $sum: {
                            $map: {
                                input: '$posts',
                                as: 'post',
                                in: { $size: '$$post.post_views' },
                            },
                        },
                    },
                    // count total likes from all posts (is_liked = true)
                    likes: {
                        $sum: {
                            $map: {
                                input: '$posts',
                                as: 'post',
                                in: {
                                    $size: {
                                        $filter: {
                                            input: '$$post.post_likes',
                                            as: 'like',
                                            cond: '$$like.is_liked',
                                        },
                                    },
                                },
                            },
                        },
                    },
                    // count total dislikes from all posts (is_liked = false)
                    dislikes: {
                        $sum: {
                            $map: {
                                input: '$posts',
                                as: 'post',
                                in: {
                                    $size: {
                                        $filter: {
                                            input: '$$post.post_likes',
                                            as: 'like',
                                            cond: { $not: '$$like.is_liked' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            {
                $unset: [
                    'posts.post_likes',
                    'posts.post_views',
                    'posts.post_comments',
                ],
            },
            {
                $project: {
                    posts: 1,
                    followers: 1,
                    followings: 1,
                    likes: 1,
                    dislikes: 1,
                    comments: 1,
                    views: 1,
                },
            },
        ];

        const [stats] = await User.aggregate(pipeline);
        return stats;
    }
}
