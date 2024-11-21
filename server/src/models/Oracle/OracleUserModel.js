import { Iusers } from '../../interfaces/userInterface.js';
import { connection } from '../../server.js';
import { verifyOrderBy } from '../../utils/verifyOrderBy.js';

export class Oracleusers extends Iusers {
    async getUser(searchInput) {
        try {
            const q = `BEGIN 
                            :result := USERS_PACKAGE.getUser(:searchInput);
                        END;`;
            const result = await connection.execute(q, {
                searchInput: { val: searchInput, type: connection.STRING },
                result: { dir: connection.BIND_OUT, type: connection.STRING },
            });

            if (!result.outBinds.result) {
                throw new Error('User not found');
            }

            return JSON.parse(result.outBinds.result);
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
            const q = `BEGIN
                            :result := USERS_PACKAGE.createUser(:userId, :userName, :firstName, :lastName, :email, :avatar, :coverImage, :password);
                        END;`;

            const result = await connection.execute(q, {
                userId: { val: userId, type: connection.STRING },
                userName: { val: userName, type: connection.STRING },
                firstName: { val: firstName, type: connection.STRING },
                lastName: { val: lastName, type: connection.STRING },
                email: { val: email, type: connection.STRING },
                avatar: { val: avatar, type: connection.STRING },
                coverImage: { val: coverImage, type: connection.STRING },
                password: { val: password, type: connection.STRING },
                result: { dir: connection.BIND_OUT, type: connection.STRING },
            });

            return result.outBinds.result;
        } catch (err) {
            throw err;
        }
    }

    async getChannelProfile(channelId, currentUserId) {
        try {
            const q = `BEGIN
                            :result := USERS_PACKAGE.getChannelProfile(:channelId, :currentUserId);
                        END;`;

            const result = await connection.execute(q, {
                channelId: { val: channelId, type: connection.STRING },
                currentUserId: { val: currentUserId, type: connection.STRING },
                result: { dir: connection.BIND_OUT, type: connection.CURSOR },
            });

            const cursor = result.outBinds.result;
            let profile = await cursor.getRows();
            cursor.close();

            if (profile.length === 0) {
                throw new Error('Profile not found');
            }

            return profile[0];
        } catch (err) {
            throw err;
        }
    }

    async getWatchHistory(userId, orderBy, limit, page) {
        try {
            if (orderBy !== 'ASC' && orderBy !== 'DESC') {
                throw new Error('Invalid order direction. Use ASC or DESC.');
            }

            const q = `BEGIN
                            :result := USERS_PACKAGE.getWatchHistory(:userId, :orderBy, :limit, :page);
                        END;`;

            const result = await connection.execute(q, {
                userId: { val: userId, type: connection.STRING },
                orderBy: { val: orderBy, type: connection.STRING },
                limit: { val: limit, type: connection.NUMBER },
                page: { val: page, type: connection.NUMBER },
                result: { dir: connection.BIND_OUT, type: connection.CURSOR },
            });

            const cursor = result.outBinds.result;
            let watchHistory = await cursor.getRows();
            cursor.close();

            if (watchHistory.length === 0) {
                throw new Error('No watch history found');
            }

            return watchHistory;
        } catch (err) {
            throw err;
        }
    }

    async deleteUser(userId) {
        try {
            const q = `BEGIN
                            :result := USERS_PACKAGE.deleteUser(:userId);
                        END;`;

            const result = await connection.execute(q, {
                userId: { val: userId, type: connection.STRING },
                result: { dir: connection.BIND_OUT, type: connection.STRING },
            });

            return result.outBinds.result;
        } catch (err) {
            throw err;
        }
    }

    async logoutUser(userId) {
        try {
            const q = `BEGIN
                            :result := USERS_PACKAGE.logoutUser(:userId);
                        END;`;

            const result = await connection.execute(q, {
                userId: { val: userId, type: connection.STRING },
                result: { dir: connection.BIND_OUT, type: connection.STRING },
            });

            return result.outBinds.result;
        } catch (err) {
            throw err;
        }
    }

    async loginUser(userId, refreshToken) {
        try {
            const q = `BEGIN
                            :result := USERS_PACKAGE.loginUser(:userId, :refreshToken);
                        END;`;

            const result = await connection.execute(q, {
                userId: { val: userId, type: connection.STRING },
                refreshToken: { val: refreshToken, type: connection.STRING },
                result: { dir: connection.BIND_OUT, type: connection.STRING },
            });

            return result.outBinds.result;
        } catch (err) {
            throw err;
        }
    }

    async updateAccountDetails(userId, firstName, lastName, email) {
        try {
            const q = `BEGIN
                            :result := USERS_PACKAGE.updateAccountDetails(:userId, :firstName, :lastName, :email);
                        END;`;

            const result = await connection.execute(q, {
                userId: { val: userId, type: connection.STRING },
                firstName: { val: firstName, type: connection.STRING },
                lastName: { val: lastName, type: connection.STRING },
                email: { val: email, type: connection.STRING },
                result: { dir: connection.BIND_OUT, type: connection.STRING },
            });

            return result.outBinds.result;
        } catch (err) {
            throw err;
        }
    }

    async updateChannelDetails(userId, userName, bio) {
        try {
            const q = `BEGIN
                            :result := USERS_PACKAGE.updateChannelDetails(:userId, :userName, :bio);
                        END;`;

            const result = await connection.execute(q, {
                userId: { val: userId, type: connection.STRING },
                userName: { val: userName, type: connection.STRING },
                bio: { val: bio, type: connection.STRING },
                result: { dir: connection.BIND_OUT, type: connection.STRING },
            });

            return result.outBinds.result;
        } catch (err) {
            throw err;
        }
    }

    async updatePassword(userId, password) {
        try {
            const q = `BEGIN
                            :result := USERS_PACKAGE.updatePassword(:userId, :password);
                        END;`;

            const result = await connection.execute(q, {
                userId: { val: userId, type: connection.STRING },
                password: { val: password, type: connection.STRING },
                result: { dir: connection.BIND_OUT, type: connection.STRING },
            });

            return result.outBinds.result;
        } catch (err) {
            throw err;
        }
    }

    async updateAvatar(userId, avatar) {
        try {
            const q = `BEGIN
                            :result := USERS_PACKAGE.updateAvatar(:userId, :avatar);
                        END;`;

            const result = await connection.execute(q, {
                userId: { val: userId, type: connection.STRING },
                avatar: { val: avatar, type: connection.STRING },
                result: { dir: connection.BIND_OUT, type: connection.STRING },
            });

            return result.outBinds.result;
        } catch (err) {
            throw err;
        }
    }

    async updateCoverImage(userId, coverImage) {
        try {
            const q = `BEGIN
                            :result := USERS_PACKAGE.updateCoverImage(:userId, :coverImage);
                        END;`;

            const result = await connection.execute(q, {
                userId: { val: userId, type: connection.STRING },
                coverImage: { val: coverImage, type: connection.STRING },
                result: { dir: connection.BIND_OUT, type: connection.STRING },
            });

            return result.outBinds.result;
        } catch (err) {
            throw err;
        }
    }
}
