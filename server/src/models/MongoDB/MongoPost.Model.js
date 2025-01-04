import { Iposts } from '../../interfaces/post.Interface.js';
import { Post, PostView, SavedPost } from '../../schemas/MongoDB/index.js';
import { getCommonPipeline1, getCommonPipeline2 } from '../../utils/index.js';

export class MongoPosts extends Iposts {
    // pending search query
    async getRandomPosts(limit, orderBy, page, categoryId) {
        try {
            const commonPipeline = getCommonPipeline1(
                categoryId,
                orderBy,
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
            const commonPipeline = getCommonPipeline1(
                categoryId,
                orderBy,
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
                                    user_id: userId,
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
                        isSaved: userId
                            ? { $gt: [{ $size: '$saved_posts' }, 0] }
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

    async getSavedPosts(userId, orderBy, limit, page) {
        try {
            const offset = (page - 1) * limit;
            const commonPipeline = getCommonPipeline2(
                orderBy,
                'savedAt',
                page,
                limit
            );
            const pipeline = [
                {
                    $match: {
                        user_id: userId,
                    },
                },
                ...commonPipeline,
            ];

            const [result] = await SavedPost.aggregate(pipeline);
            return result;
        } catch (err) {
            throw err;
        }
    }
}
