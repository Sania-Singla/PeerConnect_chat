import { Ilikes } from '../../interfaces/like.Interface.js';
import { CommentLike, PostLike } from '../../schemas/MongoDB/index.js';

export class MongoDBlikes extends Ilikes {
    // pending for testing
    async getLikedPosts(userId, orderBy, limit, page) {
        try {
            const offset = (page - 1) * limit;

            const pipeline = [
                {
                    $match: {
                        user_id: userId,
                        is_liked: true,
                    },
                },
                {
                    $lookup: {
                        from: 'posts',
                        localField: 'post_id',
                        foreignField: 'post_id',
                        as: 'post',
                        pipeline: [
                            {
                                $lookup: {
                                    from: 'users',
                                    localField: 'post_ownerId',
                                    foreignField: 'user_id',
                                    as: 'user',
                                },
                            },
                            {
                                $unwind: '$user',
                            },
                            {
                                $lookup: {
                                    from: 'categories',
                                    localField: 'post_category',
                                    foreignField: 'category_id',
                                    as: 'category',
                                },
                            },
                            {
                                $unwind: '$category',
                            },
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
                    $unwind: '$post',
                },
                {
                    $facet: {
                        /* to use $count */
                        postsInfo: [
                            { $count: 'totalPosts' },
                            {
                                $addFields: {
                                    totalPages: {
                                        $ceil: {
                                            $divide: ['$totalPosts', limit],
                                        },
                                    },
                                    hasNextPage: {
                                        $gt: [
                                            {
                                                $ceil: {
                                                    $divide: [
                                                        '$totalPosts',
                                                        limit,
                                                    ],
                                                },
                                            },
                                            page,
                                        ],
                                    },
                                    hasPrevPage: {
                                        $gt: [page, 1],
                                    },
                                },
                            },
                        ],
                        posts: [
                            {
                                $sort: {
                                    post_updatedAt: orderBy === 'DESC' ? -1 : 1,
                                },
                            },
                            { $skip: offset },
                            { $limit: limit },
                            {
                                $addFields: {
                                    post_ownerId: '$post.post_ownerId',
                                    category_name:
                                        '$post.category.category_name',
                                    post_updatedAt: '$post.post_updatedAt',
                                    post_createdAt: '$post.post_createdAt',
                                    post_title: '$post.post_title',
                                    post_content: '$post.post_content',
                                    post_image: '$post.post_image',
                                    userName: '$post.user.user_name',
                                    firstName: '$post.user.user_firstName',
                                    lastName: '$post.user.user_lastName',
                                    avatar: '$post.user.user_avatar',
                                    coverImage: '$post.user.user_coverImage',
                                    totalViews: { $size: '$post.views' },
                                },
                            },
                            {
                                $project: {
                                    user: 0,
                                    post: 0,
                                    user_id: 0,
                                    is_liked: 0,
                                },
                            },
                        ],
                    },
                },
                {
                    $unwind: '$postsInfo',
                },
            ];

            const [result] = await PostLike.aggregate(pipeline);
            return result;
        } catch (err) {
            throw err;
        }
    }

    async togglePostLike(userId, postId, likedStatus) {
        try {
            const existingRecord = await PostLike.findOne({
                post_id: postId,
                user_id: userId,
            }); // BSON data

            if (existingRecord) {
                if (existingRecord.is_liked === Boolean(likedStatus)) {
                    return await existingRecord.deleteOne();
                } else {
                    existingRecord.is_liked = likedStatus;
                    return await existingRecord.save();
                }
            } else {
                const record = await PostLike.create({
                    post_id: postId,
                    user_id: userId,
                    is_liked: likedStatus,
                });
                return record.toObject();
            }
        } catch (err) {
            throw err;
        }
    }

    async toggleCommentLike(userId, commentId, likedStatus) {
        try {
            const existingRecord = await CommentLike.findOne({
                comment_id: commentId,
                user_id: userId,
            }); // BSON data

            if (existingRecord) {
                if (existingRecord.is_liked === Boolean(likedStatus)) {
                    return await existingRecord.deleteOne();
                } else {
                    existingRecord.is_liked = likedStatus;
                    return await existingRecord.save();
                }
            } else {
                const record = await CommentLike.create({
                    comment_id: commentId,
                    user_id: userId,
                    is_liked: likedStatus,
                });
                return record.toObject();
            }
        } catch (err) {
            throw err;
        }
    }
}
