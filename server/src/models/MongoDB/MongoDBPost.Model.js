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
