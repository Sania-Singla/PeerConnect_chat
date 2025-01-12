import { Iusers } from '../../interfaces/user.Interface.js';
import { connection } from '../../server.js';
import { v4 as uuid } from 'uuid';

export class SQLusers extends Iusers {
    async getUser(searchInput) {
        try {
            const q = `
                SELECT * FROM users 
                WHERE user_id = ? OR user_name = ? OR user_email = ?
            `;

            const [[user]] = await connection.query(q, [
                searchInput,
                searchInput,
                searchInput,
            ]);

            return user;
        } catch (err) {
            throw err;
        }
    }

    async createUser({
        userName,
        firstName,
        lastName,
        avatar,
        coverImage,
        email,
        password,
    }) {
        try {
            const userId = uuid();
            const q =
                'INSERT INTO users (user_id, user_name, user_firstName, user_lastName, user_avatar, user_coverImage, user_email, user_password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

            await connection.query(q, [
                userId,
                userName,
                firstName,
                lastName,
                avatar,
                coverImage,
                email,
                password,
            ]);

            const user = await this.getUser(userId);
            const { refresh_token, user_password, ...createdUser } = user;
            return createdUser;
        } catch (err) {
            throw err;
        }
    }

    async deleteUser(userId) {
        try {
            const q = 'DELETE FROM users WHERE user_id = ?';
            return await connection.query(q, [userId]);
        } catch (err) {
            throw err;
        }
    }

    async logoutUser(userId) {
        try {
            const q = 'UPDATE users SET refresh_token = ? WHERE user_id = ?';
            return await connection.query(q, ['', userId]);
        } catch (err) {
            throw err;
        }
    }

    async loginUser(userId, refreshToken) {
        try {
            const q = 'UPDATE users SET refresh_token = ? WHERE user_id = ?';
            return await connection.query(q, [refreshToken, userId]);
        } catch (err) {
            throw err;
        }
    }

    async getChannelProfile(channelId, userId) {
        try {
            const q = 'SELECT * FROM channel_view WHERE user_id = ?';
            const [[response]] = await connection.query(q, [channelId]);

            if (channelId !== userId) {
                const q1 =
                    'SELECT COUNT(*) AS isFollowed FROM followers where following_id = ? AND follower_id = ? '; // either 0 or 1
                const [[response1]] = await connection.query(q1, [
                    channelId,
                    userId,
                ]);
                return {
                    ...response,
                    isFollowed: response1.isFollowed || false,
                };
            } else {
                return response;
            }
        } catch (err) {
            throw err;
        }
    }

    async updateAccountDetails({ userId, firstName, lastName, email }) {
        try {
            const q =
                'UPDATE users SET user_firstName = ?, user_lastName = ?, user_email = ? WHERE user_id = ?';

            await connection.query(q, [firstName, lastName, email, userId]);

            const user = await this.getUser(userId);

            const { user_password, refresh_token, ...updatedUser } = user;
            return updatedUser;
        } catch (err) {
            throw err;
        }
    }

    async updateChannelDetails({ userId, userName, bio }) {
        try {
            const q =
                'UPDATE users SET user_name = ?, user_bio = ? WHERE user_id = ?';

            await connection.query(q, [userName, bio, userId]);

            const user = await this.getUser(userId);

            const { user_password, refresh_token, ...updatedUser } = user;
            return updatedUser;
        } catch (err) {
            throw err;
        }
    }

    async updatePassword(userId, newPassword) {
        try {
            const q = 'UPDATE users SET user_password = ? WHERE user_id = ?';
            return await connection.query(q, [newPassword, userId]);
        } catch (err) {
            throw err;
        }
    }

    async updateAvatar(userId, avatar) {
        try {
            const q = 'UPDATE users SET user_avatar = ? WHERE user_id = ?';

            await connection.query(q, [avatar, userId]);

            const user = await this.getUser(userId);

            const { user_password, refresh_token, ...updatedUser } = user;
            return updatedUser;
        } catch (err) {
            throw err;
        }
    }

    async updateCoverImage(userId, coverImage) {
        try {
            const q = 'UPDATE users SET user_coverImage = ? WHERE user_id = ?';

            await connection.query(q, [coverImage, userId]);

            const user = await this.getUser(userId);

            const { user_password, refresh_token, ...updatedUser } = user;
            return updatedUser;
        } catch (err) {
            throw err;
        }
    }

    async getWatchHistory(userId, orderBy, limit, page) {
        try {
            const q = `
                    SELECT 
                        w.watchedAt,
                        w.post_id,
                        p.post_title,
                        p.post_image,
                        p.post_ownerId,
                        p.post_createdAt,
                        p.post_content,
                        p.totalViews,
                        p.category_name,
                        c.user_name AS userName,
                        c.user_firstName AS firstName,
                        c.user_lastName lastName,
                        c.user_avatar AS avatar
                    FROM watch_history w
                    JOIN post_view p 
                    ON w.post_id = p.post_id
                    JOIN channel_view c 
                    ON p.post_ownerId = c.user_id 
                    WHERE w.user_id = ?
                    ORDER BY w.watchedAt ${orderBy}
                    LIMIT ? OFFSET ? 
                `;

            const countQ =
                'SELECT COUNT(*) AS totalPosts FROM  watch_history WHERE user_id = ?';

            const offset = (page - 1) * limit;

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

    async clearWatchHistory(userId) {
        try {
            const q = 'DELETE FROM watch_history WHERE user_id = ?';
            return await connection.query(q, [userId]);
        } catch (err) {
            throw err;
        }
    }

    async updateWatchHistory(postId, userId) {
        try {
            const q = `CALL updateWatchHistory (?, ?)`;
            return await connection.query(q, [postId, userId]);
        } catch (err) {
            throw err;
        }
    }
}
