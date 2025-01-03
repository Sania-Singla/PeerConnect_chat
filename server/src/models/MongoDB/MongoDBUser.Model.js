import { Iusers } from '../../interfaces/user.Interface.js';
import { User } from '../../schemas/MongoDB/index.js';

export class MongoDBusers extends Iusers {
    async getUser(searchInput) {
        try {
            return await User.findOne({
                $or: [
                    { user_id: searchInput },
                    { user_name: searchInput },
                    { user_email: searchInput },
                ],
            }).select('-user_password -refresh_token');
        } catch (err) {
            throw err;
        }
    }

    async createUser(
        userId,
        userName,
        firstName,
        lastName,
        avatar,
        coverImage,
        email,
        password
    ) {
        try {
            const user = await User.create({
                user_id: userId,
                user_name: userName,
                user_firstName: firstName,
                user_lastName: lastName,
                user_avatar: avatar,
                user_coverImage: coverImage,
                user_email: email,
                user_password: password,
            });

            const { refresh_token, user_password, ...createdUser } = user;
            return createdUser;
        } catch (err) {
            throw err;
        }
    }

    async deleteUser(userId) {
        try {
            return await User.findByIdAndDelete(userId).select(
                '-refresh_token -user_password'
            );
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
            ).select('-refresh_token -user_password');
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
            ).select('-refresh_token -user_password');
        } catch (err) {
            throw err;
        }
    }

    async getChannelProfile(channelId, userId) {
        try {
            const pipeLine = [
                {
                    $match: {
                        user_id: channelId,
                    },
                },
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
                        from: 'followers',
                        localField: 'user_id',
                        foreignField: 'follower_id',
                        as: 'followings',
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
                                    from: 'postlikes',
                                    localField: 'posts.post_id', //from this post_id, doubt
                                    foreignField: 'post_id',
                                    as: 'post_likes',
                                },
                            },
                        ],
                    },
                },
                {
                    $lookup: {
                        from: 'postviews',
                        localField: 'user_id',
                        foreignField: 'user_id',
                        as: 'channelViews',
                    },
                },
                {
                    $addFields: {
                        isFollowed: {
                            $in: [
                                //means ki channel ke followers me ye user id hai ke nahi//check
                                userId,
                                {
                                    $map: {
                                        input: '$followers',
                                        as: 'follower',
                                        in: '$$follower.follower_id',
                                    },
                                },
                            ],
                        },
                        totalPosts: { $size: '$posts' },
                        totalFollowers: { $size: '$followers' },
                        totalFollowings: { $size: '$followings' },
                        totalLikes: { $size: '$post_likes' },
                        totalChannelViews: { $size: '$channelViews' },
                    },
                },

                {
                    $project: {
                        _id: 0,
                        __V: 0,
                        user_password: 0,
                        refresh_token: 0,
                        followers: 0,
                        followings: 0,
                        posts: 0,
                        post_likes: 0,
                        channelViews: 0,
                    },
                },
            ];
            const [channel] = await User.aggregate(pipeLine);
            return channel;
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
            ).select('-user_password -refresh_token');
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
            ).select('-user_password -refresh_token');
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
            ).select('-user_password -refresh_token');
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
            ).select('-user_password -refresh_token');
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
            ).select('-user_password -refresh_token');
        } catch (err) {
            throw err;
        }
    }

    async getWatchHistory(userId, orderBy, limit, page) {
        try {
            const offset = (page - 1) * limit;
            const pipeline = [
                {
                    $match: {
                        user_id: userId,
                    },
                },
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'post_category',
                        foreignField: 'category_id',
                        as: 'post_categories',
                    },
                },
                {
                    $unwind: '$categories',
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user_id',
                        foreignField: 'user_id',
                        as: 'post_owner',
                    },
                },
                {
                    $unwind: '$post_owner',
                },
                {
                    $lookup: {
                        from: 'post',
                        localField: 'post_id',
                        foreignField: 'post_id',
                        as: 'posts',
                    },
                },
                {
                    $unwind: '$posts',
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
                    $sort: {
                        'posts.post_updatedAt': orderBy === 'DESC' ? -1 : 1,
                    },
                },
                {
                    $skip: offset,
                },
                {
                    $limit: limit,
                },
                {
                    $count: 'totalPosts',
                },

                {
                    $addFields: {
                        totalViews: {
                            $size: '$post_views',
                        },
                        postInfo: {
                            totalPosts: '$totalPosts',
                            totalPages: Math.ceil('$totalPosts' / limit),
                            hasNextPage: page < '$totalPages', //but it is not a field nah
                            hasPrevPage: page > 1,
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        _vv: 0,
                        posts: 0,
                        post_owner: 0,
                        categories: 0,
                        'posts.post_id': 1,
                        'posts.post_title': 1,
                        'posts.post_content': 1,
                        'posts.post_updatedAt': 1,
                        'posts.post_createdAt': 1,
                        'posts.post_image': 1,
                        'post_owner.user_name': 1,
                        'post_owner.user_firstName': 1,
                        'post_owner.user_lastName': 1,
                        'post_owner.user_avatar': 1,
                        'post_owner.user_coverImage': 1,
                        'categories.category_name': 1,
                        totalViews: 1,
                    },
                },
            ];
            const [posts] = await WatchHistory.aggregate(pipeline);
            return posts;
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
            const isWatched = await WatchHistory.countDocuments({
                post_id: postId,
                user_id: userId,
            });

            if (isWatched > 0) {
                return await WatchHistory.findOneAndUpdate(
                    { post_id: postId, user_id: userId },
                    {
                        $set: {
                            updatedAt: new Date(),
                        },
                    }
                );
            } else {
                return await WatchHistory.create({
                    post_id: postId,
                    user_id: userId,
                });
            }
        } catch (err) {
            throw err;
        }
    }
}
