import { Iposts } from '../../interfaces/post.Interface.js';
import { Post, PostView, SavedPost } from '../../schemas/MongoDB/index.js';

export class MongoDBposts extends Iposts {
    getCommonPipeline(categoryId, orderBy, offset, page, limit) {
        return [
            {
                $lookup: {
                    from: 'categories',
                    localField: 'post_category',
                    foreignField: 'category_id',
                    as: 'category_name',
                    pipeline: categoryId
                        ? [
                              {
                                  $match: {
                                      category_id: categoryId,
                                  },
                              },
                          ]
                        : [],
                },
            },
            {
                $unwind: '$category_name',
            },
            {
                $addFields: {
                    category_name: '$category_name.category_name',
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'post_ownerId',
                    foreignField: 'user_id',
                    as: 'post_owner',
                },
            },
            {
                $unwind: '$post_owner',
            },
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
                    from: 'postlikes',
                    localField: 'post_id',
                    foreignField: 'post_id',
                    as: 'post_dislikes',
                    pipeline: [
                        {
                            $match: {
                                is_liked: false,
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
            {
                $lookup: {
                    from: 'comments',
                    localField: 'post_id',
                    foreignField: 'post_id',
                    as: 'post_comments',
                },
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
                                                $divide: ['$totalPosts', limit],
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
                                totalLikes: {
                                    $size: '$post_likes',
                                },
                                totalDislikes: {
                                    $size: '$post_dislikes',
                                },
                                totalViews: {
                                    $size: '$post_views',
                                },
                                totalComments: {
                                    $size: '$post_comments',
                                },
                                userName: '$post_owner.user_name',
                                firstName: '$post_owner.user_firstName',
                                lastName: '$post_owner.user_lastName',
                                avatar: '$post_owner.user_avatar',
                                coverImage: '$post_owner.user_coverImage',
                            },
                        },
                        {
                            $project: {
                                post_owner: 0,
                                post_likes: 0,
                                post_dislikes: 0,
                                post_views: 0,
                                post_comments: 0,
                            },
                        },
                    ],
                },
            },
            {
                $unwind: '$postsInfo',
            },
        ];
    }

    // pending search query
    async getRandomPosts(limit, orderBy, page, categoryId) {
        try {
            const offset = (page - 1) * limit;
            const commonPipeline = this.getCommonPipeline(
                categoryId,
                orderBy,
                offset,
                page,
                limit
            );
            const [result] = await Post.aggregate(commonPipeline);

            return result;
        } catch (err) {
            throw err;
        }
    }

    async getPosts(channelId, limit, orderBy, page, categoryId) {
        try {
            const offset = (page - 1) * limit;
            const commonPipeline = this.getCommonPipeline(
                categoryId,
                orderBy,
                offset,
                page,
                limit
            );
            const pipeline = [
                {
                    $match: {
                        post_ownerId: channelId,
                    },
                },
                ...commonPipeline,
            ];

            const [result] = await Post.aggregate(pipeline);
            return result;
        } catch (err) {
            throw err;
        }
    }

    async getPost(postId, userId) {
        try {
            const pipeline = [
                // Step 1: Match post by postId
                {
                    $match: {
                        post_id: postId,
                    },
                },
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'post_category',
                        foreignField: 'category_id',
                        as: 'category_name',
                    },
                },
                {
                    $unwind: '$category_name',
                },
                {
                    $addFields: {
                        category_name: '$category_name.category_name',
                    },
                },
                // Step 2: Lookup post owner details
                {
                    $lookup: {
                        from: 'users',
                        localField: 'post_ownerId',
                        foreignField: 'user_id',
                        as: 'post_owner',
                        pipeline: [
                            {
                                $project: {
                                    user_name: 1,
                                    user_firstName: 1,
                                    user_lastName: 1,
                                    user_avatar: 1,
                                    user_coverImage: 1,
                                },
                            },
                        ],
                    },
                },
                {
                    $unwind: '$post_owner',
                },
                // Step 3: Lookup post likes
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
                            {
                                $project: {
                                    user_id: 1,
                                },
                            },
                        ],
                    },
                },
                // Step 4: Lookup post dislikes
                {
                    $lookup: {
                        from: 'postlikes',
                        localField: 'post_id',
                        foreignField: 'post_id',
                        as: 'post_dislikes',
                        pipeline: [
                            {
                                $match: {
                                    is_liked: false,
                                },
                            },
                            {
                                $project: {
                                    user_id: 1,
                                },
                            },
                        ],
                    },
                },
                // Step 5: Lookup post views
                {
                    $lookup: {
                        from: 'postviews',
                        localField: 'post_id',
                        foreignField: 'post_id',
                        as: 'post_views',
                    },
                },
                // Step 6: Lookup post comments
                {
                    $lookup: {
                        from: 'comments',
                        localField: 'post_id',
                        foreignField: 'post_id',
                        as: 'post_comments',
                    },
                },
                // Step 7: Lookup saved posts
                {
                    $lookup: {
                        from: 'savedposts',
                        localField: 'post_id',
                        foreignField: 'post_id',
                        as: 'saved_posts',
                        pipeline: [
                            {
                                $project: {
                                    user_id: 1,
                                },
                            },
                        ],
                    },
                },
                {
                    $lookup: {
                        from: 'followers',
                        localField: 'post_ownerId',
                        foreignField: 'following_id',
                        as: 'followers',
                        pipeline: [
                            {
                                $match: {
                                    follower_id: userId,
                                },
                            },
                        ],
                    },
                },
                // Step 8: Add conditional fields and computed fields
                {
                    $addFields: {
                        isFollowed: userId
                            ? { $gt: [{ $size: '$followers' }, 0] }
                            : false,
                        isLiked: userId
                            ? {
                                  $in: [
                                      userId,
                                      {
                                          $map: {
                                              input: '$post_likes',
                                              as: 'like',
                                              in: '$$like.user_id',
                                          },
                                      },
                                  ],
                              }
                            : false,
                        isDisliked: userId
                            ? {
                                  $in: [
                                      userId,
                                      {
                                          $map: {
                                              input: '$post_dislikes',
                                              as: 'dislike',
                                              in: '$$dislike.user_id',
                                          },
                                      },
                                  ],
                              }
                            : false,
                        isSaved: userId
                            ? {
                                  $in: [
                                      userId,
                                      {
                                          $map: {
                                              input: '$saved_posts',
                                              as: 'save',
                                              in: '$$save.user_id',
                                          },
                                      },
                                  ],
                              }
                            : false,
                        totalLikes: {
                            $size: '$post_likes',
                        },
                        totalDislikes: {
                            $size: '$post_dislikes',
                        },
                        totalViews: {
                            $size: '$post_views',
                        },
                        totalComments: {
                            $size: '$post_comments',
                        },
                        userName: '$post_owner.user_name',
                        firstName: '$post_owner.user_firstName',
                        lastName: '$post_owner.user_lastName',
                        avatar: '$post_owner.user_avatar',
                        coverImage: '$post_owner.user_coverImage',
                    },
                },
                // Step 9: Project final fields
                {
                    $project: {
                        post_owner: 0,
                        post_likes: 0,
                        post_dislikes: 0,
                        post_views: 0,
                        post_comments: 0,
                        saved_posts: 0,
                    },
                },
            ];

            const [post] = await Post.aggregate(pipeline);
            return post;
        } catch (err) {
            throw err;
        }
    }

    async createPost({
        postId,
        userId,
        title,
        content,
        categoryId,
        postImage,
    }) {
        try {
            const post = await Post.create({
                post_id: postId,
                post_ownerId: userId,
                post_title: title,
                post_content: content,
                post_category: categoryId,
                post_image: postImage,
            });
            return post.toObject();
        } catch (err) {
            throw err;
        }
    }

    async deletePost(postId) {
        try {
            return await Post.findOneAndDelete({
                post_id: postId,
            }).lean();
        } catch (err) {
            throw err;
        }
    }

    // Hook but working
    async updatePostViews(postId, userIdentifier) {
        try {
            return await PostView.findOneAndUpdate(
                {
                    post_id: postId,
                    user_identifier: userIdentifier,
                },
                {
                    $setOnInsert: {
                        post_id: postId,
                        user_identifier: userIdentifier,
                    },
                },
                {
                    upsert: true,
                }
            ).lean();
        } catch (err) {
            throw err;
        }
    }

    async updatePostDetails({ postId, title, content, categoryId }) {
        try {
            return await Post.findOneAndUpdate(
                { post_id: postId },
                {
                    $set: {
                        post_title: title,
                        post_content: content,
                        post_category: categoryId,
                        post_updatedAt: new Date(),
                    },
                },
                { new: true }
            ).lean();
        } catch (err) {
            throw err;
        }
    }

    async updatePostImage(postId, postImage) {
        try {
            return await Post.findOneAndUpdate(
                { post_id: postId },
                {
                    $set: {
                        post_image: postImage,
                        post_updatedAt: new Date(),
                    },
                },
                { new: true }
            ).lean();
        } catch (err) {
            throw err;
        }
    }

    async togglePostVisibility(postId, visibility) {
        try {
            return await Post.findOneAndUpdate(
                { post_id: postId },
                { $set: { post_visibility: visibility } },
                { new: true }
            ).lean();
        } catch (err) {
            throw err;
        }
    }

    async toggleSavePost(userId, postId) {
        try {
            const existingRecord = await SavedPost.findOne({
                post_id: postId,
                user_id: userId,
            });

            if (existingRecord) {
                return await existingRecord.deleteOne();
            } else {
                const record = await SavedPost.create({
                    post_id: postId,
                    user_id: userId,
                });
                return record.toObject();
            }
        } catch (err) {
            throw err;
        }
    }

    // pending for testing
    async getSavedPosts(userId, orderBy, limit, page) {
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

            const [result] = await SavedPost.aggregate(pipeline);
            return result;
        } catch (err) {
            throw err;
        }
    }
}
