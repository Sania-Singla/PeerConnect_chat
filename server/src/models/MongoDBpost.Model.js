import { Iposts } from '../interfaces/post.Interface.js';
import { Post, PostView, SavedPost } from '../schemas/index.js';
import { getPipeline1 } from '../helpers/index.js';

export class MongoDBposts extends Iposts {
    // pending search query
    async getRandomPosts(limit, orderBy, page, categoryId) {
        try {
            const pipeline = categoryId
                ? [{ $match: { post_category: categoryId } }]
                : [];

            pipeline.push(
                ...[
                    {
                        $lookup: {
                            from: 'categories',
                            localField: 'post_category',
                            foreignField: 'category_id',
                            as: 'category',
                        },
                    },
                    { $unwind: '$category' },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'post_ownerId',
                            foreignField: 'user_id',
                            as: 'owner',
                            pipeline: [
                                {
                                    $project: {
                                        user_id: 1,
                                        user_name: 1,
                                        user_avatar: 1,
                                        user_fullName: 1,
                                    },
                                },
                            ],
                        },
                    },
                    { $unwind: '$owner' },
                    {
                        $lookup: {
                            from: 'postviews',
                            localField: 'post_id',
                            foreignField: 'post_id',
                            as: 'views',
                        },
                    },
                    { $sort: { post_updatedAt: orderBy === 'DESC' ? -1 : 1 } },
                    { $addFields: { totalViews: { $size: '$views' } } },
                    { $project: { post_category: 0, views: 0 } },
                ]
            );

            return await Post.aggregatePaginate(pipeline, { page, limit });
        } catch (err) {
            throw err;
        }
    }

    async getPosts(channelId, limit, orderBy, page, categoryId) {
        try {
            const pipeline = categoryId
                ? [
                      {
                          $match: {
                              post_ownerId: channelId,
                              post_category: categoryId,
                          },
                      },
                  ]
                : [{ $match: { post_ownerId: channelId } }];

            // concat() returns a modified new array
            pipeline.push(
                ...[
                    {
                        $lookup: {
                            from: 'categories',
                            localField: 'post_category',
                            foreignField: 'category_id',
                            as: 'category',
                        },
                    },
                    { $unwind: '$category' },
                    {
                        $lookup: {
                            from: 'postviews',
                            localField: 'post_id',
                            foreignField: 'post_id',
                            as: 'views',
                        },
                    },
                    { $sort: { post_updatedAt: orderBy === 'DESC' ? -1 : 1 } },
                    { $addFields: { totalViews: { $size: '$views' } } },
                    { $project: { post_category: 0, views: 0 } },
                ]
            );

            return await Post.aggregatePaginate(pipeline, { page, limit });
        } catch (err) {
            throw err;
        }
    }

    async postExistance(postId) {
        try {
            return await Post.findOne({ post_id: postId }).lean();
        } catch (err) {
            throw err;
        }
    }

    async getPost(postId, userId) {
        try {
            const pipeline = [
                { $match: { post_id: postId } },
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'post_category',
                        foreignField: 'category_id',
                        as: 'category',
                    },
                },
                { $unwind: '$category' },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'post_ownerId',
                        foreignField: 'user_id',
                        as: 'owner',
                    },
                },
                { $unwind: '$owner' },
                {
                    $lookup: {
                        from: 'postlikes',
                        localField: 'post_id',
                        foreignField: 'post_id',
                        as: 'likes',
                        pipeline: [
                            { $match: { is_liked: true } },
                            { $project: { user_id: 1 } },
                        ],
                    },
                },
                {
                    $lookup: {
                        from: 'postlikes',
                        localField: 'post_id',
                        foreignField: 'post_id',
                        as: 'dislikes',
                        pipeline: [
                            { $match: { is_liked: false } },
                            { $project: { user_id: 1 } },
                        ],
                    },
                },
                {
                    $lookup: {
                        from: 'postviews',
                        localField: 'post_id',
                        foreignField: 'post_id',
                        as: 'views',
                    },
                },
                {
                    $addFields: {
                        totalLikes: { $size: '$likes' },
                        totalDislikes: { $size: '$dislikes' },
                        totalViews: { $size: '$views' },
                    },
                },
            ];

            // Conditionally add user-related stages
            if (userId) {
                pipeline.push(
                    {
                        $lookup: {
                            from: 'savedposts',
                            localField: 'post_id',
                            foreignField: 'post_id',
                            as: 'saved_posts',
                            pipeline: [{ $match: { user_id: userId } }],
                        },
                    },
                    {
                        $lookup: {
                            from: 'followers',
                            localField: 'post_ownerId',
                            foreignField: 'following_id',
                            as: 'followers',
                            pipeline: [{ $match: { follower_id: userId } }],
                        },
                    },
                    {
                        $addFields: {
                            isFollowed: { $gt: [{ $size: '$followers' }, 0] },
                            isSaved: { $gt: [{ $size: '$saved_posts' }, 0] },
                            isLiked: {
                                $in: [
                                    userId,
                                    {
                                        $map: {
                                            input: '$likes',
                                            as: 'like',
                                            in: '$$like.user_id',
                                        },
                                    },
                                ],
                            },
                            isDisliked: {
                                $in: [
                                    userId,
                                    {
                                        $map: {
                                            input: '$dislikes',
                                            as: 'dislike',
                                            in: '$$dislike.user_id',
                                        },
                                    },
                                ],
                            },
                        },
                    }
                );
            }

            pipeline.push({ $project: { likes: 0, dislikes: 0, views: 0 } });

            const [post] = await Post.aggregate(pipeline);
            return post;
        } catch (err) {
            throw err;
        }
    }

    async createPost({ userId, title, content, categoryId, postImage }) {
        try {
            const post = await Post.create({
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
            return await Post.findOneAndDelete({ post_id: postId }).lean();
        } catch (err) {
            throw err;
        }
    }

    // TODO: can use pre-hook
    async updatePostViews(postId, userIdentifier) {
        try {
            return await PostView.findOneAndUpdate(
                { post_id: postId, user_identifier: userIdentifier },
                {
                    $setOnInsert: {
                        post_id: postId,
                        user_identifier: userIdentifier,
                    },
                },
                { upsert: true }
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

    async getSavedPosts(userId, orderBy, limit, page) {
        try {
            const pipeline1 = getPipeline1(orderBy, 'savedAt');
            const pipeline = [{ $match: { user_id: userId } }, ...pipeline1];
            return await SavedPost.aggregatePaginate(pipeline, { page, limit });
        } catch (err) {
            throw err;
        }
    }
}
