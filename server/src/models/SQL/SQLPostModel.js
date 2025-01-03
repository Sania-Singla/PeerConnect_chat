import { Iposts } from '../../interfaces/post.Interface.js';
import { connection } from '../../server.js';
import { getCurrentTimestamp } from '../../utils/index.js';

export class SQLposts extends Iposts {
    // pending search query
    async getRandomPosts(limit, orderBy, page, categoryId) {
        try {
            let q = `
                    SELECT 
                        p.*,
                        c.user_name AS userName,
                        c.user_firstName AS firstName,
                        c.user_lastName AS lastName,
                        c.user_avatar AS avatar,
                        c.user_coverImage AS coverImage 
                    FROM post_view p 
                    JOIN channel_view c 
                    ON p.post_ownerId = c.user_id 
                `;

            let countQ = 'SELECT COUNT(*) AS totalPosts FROM post_view p ';

            if (category) {
                q += ` WHERE p.category_id = ? `;
                countQ += ` WHERE p.category_id = ? `;
            }

            q += ` ORDER BY post_updatedAt ${orderBy} LIMIT ? OFFSET ? `;

            const offset = (page - 1) * limit;

            const queryParams = categoryId
                ? [categoryId, limit, offset]
                : [limit, offset];

            const countParams = categoryId ? [categoryId] : [];

            const [[{ totalPosts }]] = await connection.query(
                countQ,
                countParams
            );

            if (totalPosts === 0) {
                return null;
            }

            const [posts] = await connection.query(q, queryParams);

            const totalPages = Math.ceil(totalPosts / limit);
            const hasNextPage = page < totalPages;
            const hasPrevPage = page > 1;
            return {
                postsInfo: {
                    totalPosts,
                    totalPages,
                    hasNextPage,
                    hasPrevPage,
                },
                posts,
            };
        } catch (err) {
            throw err;
        }
    }

    async getPosts(channelId, limit, orderBy, page, categoryId) {
        try {
            let q = `
                    SELECT 
                        p.*,
                        c.user_name AS userName,
                        c.user_firstName AS firstName,
                        c.user_lastName AS lastName,
                        c.user_avatar AS avatar,
                        c.user_coverImage AS coverImage
                    FROM post_view p 
                    JOIN channel_view c 
                    ON p.post_ownerId = c.user_id
                `;

            let countQ = 'SELECT COUNT(*) AS totalPosts FROM post_view p';

            if (categoryId) {
                q += ` WHERE p.post_ownerId = ? AND p.category_id = ? `;
                countQ += ` WHERE p.post_ownerId = ? AND p.category_id = ? `;
            } else {
                q += ' WHERE p.post_ownerId = ? ';
                countQ += ' WHERE p.post_ownerId = ? ';
            }

            q += `ORDER BY post_updatedAt ${orderBy} LIMIT ? OFFSET ? `;

            const offset = (page - 1) * limit;
            const queryParams = categoryId
                ? [channelId, categoryId, limit, offset]
                : [channelId, limit, offset];
            const countParams = categoryId
                ? [channelId, categoryId]
                : [channelId];

            const [[{ totalPosts }]] = await connection.query(
                countQ,
                countParams
            );

            if (totalPosts === 0) {
                return null;
            }

            const [posts] = await connection.query(q, queryParams);

            const totalPages = Math.ceil(totalPosts / limit);
            const hasNextPage = page < totalPages;
            const hasPrevPage = page > 1;
            return {
                postsInfo: {
                    totalPosts,
                    totalPages,
                    hasNextPage,
                    hasPrevPage,
                },
                posts,
            };
        } catch (err) {
            throw err;
        }
    }

    async getPost(postId, userId) {
        try {
            const q = `
                    SELECT 
                        p.*,
                        c.user_name AS userName,
                        c.user_firstName AS firstName,
                        c.user_lastName AS lastName,
                        c.user_avatar AS avatar,
                        c.user_coverImage AS coverImage
                    FROM post_view p 
                    JOIN channel_view c 
                    ON c.user_id = p.post_ownerId
                    WHERE post_id = ?
                `;

            const [[post]] = await connection.query(q, [postId]);
            if (!post) {
                return null;
            }

            let isLiked = false;
            let isDisliked = false;
            let isSaved = false;
            let isFollowed = false;

            if (userId) {
                const q1 =
                    'SELECT is_liked FROM post_likes WHERE post_id = ? AND user_id = ?';
                const [[response1]] = await connection.query(q1, [
                    postId,
                    userId,
                ]);
                if (response1) {
                    if (response1.is_liked) isLiked = true;
                    else isDisliked = true;
                }

                const q2 =
                    'SELECT COUNT(*) AS isSaved FROM saved_posts WHERE post_id = ? AND user_id = ?';
                const [[response2]] = await connection.query(q2, [
                    postId,
                    userId,
                ]);
                if (response2?.isSaved) {
                    isSaved = true;
                }

                const q3 =
                    'SELECT COUNT(*) AS isFollowed FROM followers WHERE following_id = ? AND follower_id = ?';
                const [[response3]] = await connection.query(q3, [
                    post.post_ownerId,
                    userId,
                ]);
                if (response3?.isFollowed) {
                    isFollowed = true;
                }
            }

            return {
                ...post,
                isLiked,
                isDisliked,
                isSaved,
                isFollowed,
            };
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
            const q =
                'INSERT INTO posts (post_id, post_ownerId, post_title, post_content, post_category, post_image) VALUES (?, ?, ?, ?, ?, ?)';
            await connection.query(q, [
                postId,
                userId,
                title,
                content,
                categoryId,
                postImage,
            ]);

            const post = await this.getPost(postId, userId);

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
            const q = 'DELETE FROM posts WHERE post_id = ?';
            return await connection.query(q, [postId]);
        } catch (err) {
            throw err;
        }
    }

    async updatePostViews(postId, userIdentifier) {
        try {
            const q = `INSERT IGNORE INTO post_views values(?, ?)`; // wont throw error if record already exists
            return await connection.query(q, [postId, userIdentifier]);
        } catch (err) {
            throw err;
        }
    }

    async updatePostDetails({ postId, title, content, categoryId }) {
        try {
            const now = new Date();
            const updatedAt = getCurrentTimestamp(now);

            const q =
                'UPDATE posts SET post_title = ?, post_content = ?, post_category = ?, post_updatedAt = ? WHERE post_id = ?';
            await connection.query(q, [
                title,
                content,
                categoryId,
                updatedAt,
                postId,
            ]);
            return await this.getPost(postId);
        } catch (err) {
            throw err;
        }
    }

    async updatePostImage(postId, postImage) {
        try {
            const now = new Date();
            const updatedAt = getCurrentTimestamp(now);

            const q =
                'UPDATE posts SET post_image = ?, post_updatedAt = ? WHERE post_id = ?';
            await connection.query(q, [postImage, updatedAt, postId]);

            return await this.getPost(postId);
        } catch (err) {
            throw err;
        }
    }

    async togglePostVisibility(postId, visibility) {
        try {
            const q = 'UPDATE posts SET post_visibility = ? WHERE post_id = ?';
            return await connection.query(q, [visibility, postId]);
        } catch (err) {
            throw err;
        }
    }

    async toggleSavePost(userId, postId) {
        try {
            const q = 'CALL toggleSavePost(?, ?)';
            return await connection.query(q, [userId, postId]);
        } catch (err) {
            throw err;
        }
    }

    async getSavedPosts(userId, orderBy, limit, page) {
        try {
            const q = `
                    SELECT
                    	c.user_id,
                        c.user_name AS userName,
                        c.user_firstName AS firstName,
                        c.user_lastName lastName,
                        c.user_avatar AS avatar,
                        p.post_id, 
                        p.category_name,
                        p.post_updatedAt,
                        p.post_createdAt, 
                        p.post_title, 
                        p.post_content, 
                        p.totalViews,
                        p.post_ownerId,
                        p.post_image
                    FROM post_view p
                    JOIN channel_view c
                    ON p.post_ownerId = c.user_id 
                    JOIN saved_posts s
                    ON p.post_id = s.post_id 
                    WHERE s.user_id = ?
                    ORDER BY p.post_updatedAt ${orderBy} 
                    LIMIT ? OFFSET ?
                `;

            const offset = (page - 1) * limit;

            const countQ =
                'SELECT COUNT(*) AS totalPosts FROM saved_posts WHERE user_id = ?';

            const [[{ totalPosts }]] = await connection.query(countQ, [userId]);
            if (totalPosts === 0) {
                return null;
            }

            const [posts] = await connection.query(q, [userId, limit, offset]);

            const totalPages = Math.ceil(totalPosts / limit);
            const hasNextPage = page < totalPages;
            const hasPrevPage = page > 1;

            return {
                postsInfo: {
                    totalPosts,
                    totalPages,
                    hasNextPage,
                    hasPrevPage,
                },
                posts,
            };
        } catch (err) {
            throw err;
        }
    }
}
