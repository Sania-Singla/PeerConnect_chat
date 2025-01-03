import { Iposts } from '../../interfaces/post.Interface.js';
import { Category, Post, PostView } from '../../schemas/MongoDB/index.js';

export class MongoDBposts extends Iposts {
    // pending search query
    async getRandomPosts(limit, orderBy, page, category) {
        try {
            const offset = (page - 1) * limit;

            const pipeline = [
                //All posts of a particular user
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'post_category',
                        foreignField: 'category_id',
                        as: 'post_categories',
                    },
                },

                {
                    $match: category
                        ? {
                              //$ or not
                              'post_categories.category_name': category,
                          }
                        : {},
                },
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
                                    user_id: 1,
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
                //No need of total posts , total likes, total dislikes
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
                    $lookup: {
                        from: 'savedposts',
                        localField: 'post_id',
                        foreignField: 'post_id',
                        as: 'saved_posts',
                    },
                },
                {
                    $sort: {
                        post_updatedAt: orderBy === 'DESC' ? -1 : 1,
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
                        postInfo: {
                            totalPosts: '$totalPosts',
                            totalPages: Math.ceil('$totalPosts' / limit),
                            hasNextPage: page < '$totalPages',
                            hasPrevPage: page > 1,
                        },
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
                        _id: 0,
                        __v: 0,
                        post_owner: 0,
                        post_likes: 0,
                        post_dislikes: 0,
                        post_views: 0,
                        post_comments: 0,
                        saved_posts: 0,
                        totalPosts: 0,
                    },
                },
            ];

            const [post] = Post.aggregate(pipeline);

            return post;
        } catch (err) {
            throw err;
        }
    }

    async getPosts(channelId, limit, orderBy, page, category) {
        try {
            const offset = (page - 1) * limit;

            const pipeline = [
                //All posts of a particular user
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'post_category',
                        foreignField: 'category_id',
                        as: 'post_categories',
                    },
                },

                {
                    $match: category
                        ? {
                              //$ or not??
                              'post_categories.category_name': category,
                              post_ownerId: channelId,
                          }
                        : {
                              post_ownerId: channelId,
                          },
                },
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
                                    user_id: 1,
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
                //No need of total posts , total likes, total dislikes
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
                    $lookup: {
                        from: 'savedposts',
                        localField: 'post_id',
                        foreignField: 'post_id',
                        as: 'saved_posts',
                    },
                },
                {
                    $sort: {
                        post_updatedAt: orderBy === 'DESC' ? -1 : 1,
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
                        postInfo: {
                            totalPosts: '$totalPosts',
                            totalPages: Math.ceil('$totalPosts' / limit),
                            hasNextPage: page < '$totalPages',
                            hasPrevPage: page > 1,
                        },
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
                        _id: 0,
                        __v: 0,
                        post_owner: 0,
                        post_likes: 0,
                        post_dislikes: 0,
                        post_views: 0,
                        post_comments: 0,
                        saved_posts: 0,
                        totalPosts: 0,
                    },
                },
            ];

            const [post] = Post.aggregate(pipeline);

            return post;
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
            const isSaved = await SavedPost.countDocuments({
                post_id: postId,
                user_id: userId,
            });

            if (isSaved > 0) {
                return await SavedPost.deleteOne({
                    post_id: postId,
                    user_id: userId,
                });
            } else {
                return await SavedPost.create({
                    post_id: postId,
                    user_id: userId,
                });
            }
        } catch (err) {
            throw err;
        }
    }

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
                    //extra se need nahi hai project ki kunki addFields me bata rhe hai kon kon si filed jayegi
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
                            hasNextPage: page < '$totalPages',
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

            const [posts] = await SavedPost.aggregate(pipeline);
            return posts;
        } catch (err) {
            throw err;
        }
    }
}
