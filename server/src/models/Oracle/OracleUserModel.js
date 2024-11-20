import { Iusers } from '../../interfaces/userInterface.js';
import { connection } from '../../server.js';
import validator from 'validator';
import { verifyOrderBy } from '../../utils/verifyOrderBy.js';

export class Oracleusers extends Iusers {
    async getUser(searchInput) {
        try {
            let q;
            if (validator.isEmail(searchInput)) {
                q = "CALL getUser('email',?)";
            } else if (validator.isUUID(searchInput)) {
                q = "CALL getUser('uuid',?);";
            } else {
                q = "CALL getUser('username',?);";
            }

            const [[[user]]] = await connection.query(q, [searchInput]);

            return user;
        } catch (err) {
            throw err;
        }
    }

    async createUser(
        userId,
        userName,
        firstName,
        lastName,
        avatar,
        coverImage,
        email,
        password
    ) {
        try {
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

            if (user?.message) {
                throw new Error('USER_CREATION_DB_ISSUE');
            }
            const { refresh_token, ...createdUser } = user; // to exclude the password from the response
            return createdUser;
        } catch (err) {
            throw err;
        }
    }

    async deleteUser(userId) {
        try {
            const q = 'DELETE FROM users WHERE user_id = ?';

            const [result] = await connection.query(q, [userId]);

            if (result.affectedRows === 0) {
                throw new Error('USER_DELETION_DB_ISSUE');
            }
        } catch (err) {
            throw err;
        }
    }

    async logoutUser(userId) {
        try {
            const q = 'UPDATE users SET refresh_token = ? WHERE user_id = ?';
            await connection.query(q, ['', userId]);

            const user = await this.getUser(userId);

            if (user?.refresh_token !== '') {
                throw new Error('REFRESH_TOKEN_NOT_DELETED_IN_DB');
            }
            return user;
        } catch (err) {
            throw err;
        }
    }

    async updateRefreshToken(userId, refreshToken) {
        try {
            const q = 'UPDATE users SET refresh_token = ? WHERE user_id = ?';
            await connection.query(q, [refreshToken, userId]);
            const user = await this.getUser(userId);
            if (user?.refresh_token === '') {
                throw new Error('REFRESH_TOKEN_NOT_SAVED_IN_DB');
            }
        } catch (err) {
            throw err;
        }
    }

    async getChannelProfile(channelId, currentUserId) {
        try {
            let isFollowed = false;
            const q1 =
                'SELECT COUNT(*) AS isFollowed FROM followers where following_id = ? AND follower_id = ? '; // either 0 or 1
            if (currentUserId) {
                const [[response1]] = await connection.query(q1, [
                    channelId,
                    currentUserId,
                ]);
                if (response1.isFollowed) {
                    isFollowed = true;
                }
            }

            const q = 'SELECT * FROM channel_view WHERE user_id = ?';
            const [[response]] = await connection.query(q, [channelId]);
            if (!response) {
                throw new Error('CHANNEL_FETCHING_DB_ISSUE');
            }

            return { ...response, isFollowed };
        } catch (err) {
            throw err;
        }
    }

    async updateAccountDetails(userId, firstName, lastName, email) {
        try {
            const q =
                'UPDATE users SET user_firstName = ?, user_lastName = ?, user_email = ? WHERE user_id = ?';

            await connection.query(q, [firstName, lastName, email, userId]);

            const user = await this.getUser(userId);

            if (user?.message) {
                throw new Error('ACCOUNT_DETAILS_UPDATION_DB_ISSUE');
            }

            const { user_password, refresh_token, ...updatedUser } = user;
            return updatedUser;
        } catch (err) {
            throw err;
        }
    }

    async updateChannelDetails(userId, userName, bio) {
        try {
            const q =
                'UPDATE users SET user_name = ?, user_bio = ? WHERE user_id = ?';

            await connection.query(q, [userName, bio, userId]);

            const user = await this.getUser(userId);

            if (user?.message) {
                throw new Error('PROFILE_DETAILS_UPDATION_DB_ISSUE');
            }

            const { user_password, refresh_token, ...updatedUser } = user;
            return updatedUser;
        } catch (err) {
            throw err;
        }
    }

    async updatePassword(userId, newPassword) {
        try {
            const q = 'UPDATE users SET user_password = ? WHERE user_id = ?';

            await connection.query(q, [newPassword, userId]);

            const user = await this.getUser(userId);

            if (user?.message) {
                throw new Error('PASSWORD_UPDATION_DB_ISSUE');
            }

            const { user_password, refresh_token, ...updatedUser } = user; // we dont show password anywhere (no need to return though)
            return updatedUser;
        } catch (err) {
            throw err;
        }
    }

    async updateAvatar(userId, avatar) {
        try {
            const q = 'UPDATE users SET user_avatar = ? WHERE user_id = ?';

            await connection.query(q, [avatar, userId]);

            const user = await this.getUser(userId);

            if (user?.message) {
                throw new Error('AVATAR_UPDATION_DB_ISSUE');
            }

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

            if (user?.message) {
                throw new Error('COVERIMAGE_UPDATION_DB_ISSUE');
            }

            const { user_password, refresh_token, ...updatedUser } = user;
            return updatedUser;
        } catch (err) {
            throw err;
        }
    }

    async getWatchHistory(userId, orderBy, limit, page) {
        try {
            verifyOrderBy(orderBy);

            const q = `
                    SELECT 
                        w.watchedAt,
                        w.post_id,
                        p.post_title,
                        p.post_image,
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
            const [posts] = await connection.query(q, [userId, limit, offset]);

            if (!posts?.length) {
                return { message: 'EMPTY_WATCH_HISTORY' };
            }

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
            const response = await connection.query(q, [userId]);
            if (response.affectedRows === 0) {
                throw new Error({
                    message: 'CLEARING_WATCH_HISTORY_DB_ISSUE',
                });
            }
            return {
                message: 'WATCH_HISTORY_CLEARED_SUCCESSFULLY',
            };
        } catch (err) {
            throw err;
        }
    }

    async updateWatchHistory(postId, userId) {
        try {
            const q = `CALL updateWatchHistory (?, ?)`;
            const [[[response]]] = await connection.query(q, [postId, userId]);
            return response;
        } catch (err) {
            throw err;
        }
    }
}
