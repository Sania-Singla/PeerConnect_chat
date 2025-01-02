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

    async createPost(postId, ownerId, title, content, category, image) {
        try {
            const categoryId = await Category.findOne({
                category_name: category,
            }).project({ category_id: 1 });

            if (!categoryId) {
                return { message: 'CATEGORY_NOT_FOUND' };
            }

            const post = await Post.create({
                post_id: postId,
                post_ownerId: ownerId,
                post_title: title,
                post_content: content,
                post_category: categoryId,
                post_image: image,
            });
            //other info left
            const {
                post_likes,
                post_dislikes,
                post_views,
                isLiked,
                isDisliked,
                isSaved,
                ...remainingPostDetails
            } = post;
            return remainingPostDetails;
        } catch (err) {
            throw err;
        }
    }

    async deletePost(postId) {
        try {
            const deletedPost = await Comment.deleteOne({
                post_id: postId,
            });
            if (deletedPost.deletedCount === 0) {
                throw new Error('POST_DELETION_DB_ISSUE');
            }
            //result is to be sent directly through controller in sql model!
            return { message: 'POST_DELETED_SUCCESSFULLY' };
        } catch (err) {
            throw err;
        }
    }

    async updatePostViews(postId, userIdentifier) {
        try {
            const postCount = await PostView.countDocuments({
                post_id: postId,
                user_identifier: userIdentifier,
            });

            if (postCount>0) {
                return {message: 'POST_ALREADY_VIEWED'};
            }

            const postView = await PostView.create({
                post_id: postId,
                user_identifier: userIdentifier,
            });

            if (!postView) {
                throw new Error('VIEW_INCREMENT_DB_ISSUE');
            }
            return { message: 'VIEW_INCREMENTED_SUCCESSFULLY' };
        } catch (err) {
            throw err;
        }
    }

    async updatePostDetails(postId, title, content, category, updatedAt) {
        try {
            const categoryId = await Category.findOne({
                category_name: category,
            }).project({ category_id: 1 });

            if (!categoryId) {
                return { message: 'CATEGORY_NOT_FOUND' };
            }

            const updatedPost = await Post.updateOne(
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

            return updatedPost;
        } catch (err) {
            throw err;
        }
    }

    async updatePostImage(postId, image, updatedAt) {
        try {
            const updatedPost = await Post.updateOne(
                { post_d: postId },
                {
                    $set: {
                        post_image: image,
                        post_updatedAt: updatedAt,
                    },
                },
                { new: true }
            );

            return updatedPost;
        } catch (err) {
            throw err;
        }
    }

    async togglePostVisibility(postId, visibility) {
        try {
            const updatedPost = await Post.updateOne(
                { post_id: postId },
                { $set: { post_visibility: visibility } },
                { new: true }
            );

            return updatedPost;
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
