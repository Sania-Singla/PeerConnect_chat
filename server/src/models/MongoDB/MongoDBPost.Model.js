import { Iposts } from '../../interfaces/post.Interface.js';
import { Category, Post, PostView } from '../../schemas/MongoDB/index.js';

export class MongoDBposts extends Iposts {
    // pending search query
    async getRandomPosts(limit, orderBy, page, category) {
        try {
        } catch (err) {
            throw err;
        }
    }

    async getPosts(channelId, limit, orderBy, page, category) {
        try {
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
                                    _id: 0,
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
                                    is_liked: 1,
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
                                    is_liked: 0,
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
                // Step 8: Add conditional fields and computed fields
                {
                    $addFields: {
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
                        _id: 0,
                        __v: 0,
                    },
                },
            ];

            const post = await Post.aggregate(pipeline);
            return post[0];
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
            return await Post.create({
                post_id: postId,
                post_ownerId: userId,
                post_title: title,
                post_content: content,
                post_category: categoryId,
                post_image: postImage,
            });
        } catch (err) {
            throw err;
        }
    }

    async deletePost(postId) {
        try {
            return await Comment.deleteOne({
                post_id: postId,
            });
        } catch (err) {
            throw err;
        }
    }

    // Hook
    async updatePostViews(postId, userIdentifier) {
        try {
            const postCount = await PostView.countDocuments({
                post_id: postId,
                user_identifier: userIdentifier,
            });

            if (postCount > 0) {
                return { message: 'POST_ALREADY_VIEWED' };
            }

            const postView = await PostView.create({
                post_id: postId,
                user_identifier: userIdentifier,
            });
        } catch (err) {
            throw err;
        }
    }

    async updatePostDetails({ postId, title, content, categoryId }) {
        try {
            const now = new Date();
            const updatedAt = getCurrentTimestamp(now);

            return await Post.updateOne(
                { post_id: postId },
                {
                    $set: {
                        post_title: title,
                        post_content: content,
                        post_category: categoryId,
                        post_updatedAt: updatedAt,
                    },
                },
                { new: true }
            );
        } catch (err) {
            throw err;
        }
    }

    async updatePostImage(postId, postImage) {
        try {
            const now = new Date();
            const updatedAt = getCurrentTimestamp(now);

            return await Post.updateOne(
                { post_id: postId },
                {
                    $set: {
                        post_image: postImage,
                        post_updatedAt: updatedAt,
                    },
                },
                { new: true }
            );
        } catch (err) {
            throw err;
        }
    }

    async togglePostVisibility(postId, visibility) {
        try {
            return await Post.updateOne(
                { post_id: postId },
                { $set: { post_visibility: visibility } },
                { new: true }
            );
        } catch (err) {
            throw err;
        }
    }

    async toggleSavePost(postId, userId) {
        try {
        } catch (err) {
            throw err;
        }
    }

    async getSavedPosts(userId, orderBy, limit, page) {
        try {
        } catch (err) {
            throw err;
        }
    }
}
