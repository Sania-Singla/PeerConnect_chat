import { Iusers } from '../../interfaces/user.Interface.js';
import { User } from '../../schemas/MongoDB/index.js';
export class MongoDBusers extends Iusers {
    async getUser(searchInput) {
        try {
            const user = await User.findOne({
                searchInput: {
                    $in: [user_id, user_name, user_email],
                },
            });

            if (!user) {
                return { message: 'USER_NOT_FOUND' };
            }

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
            const user = await User.create({
                user_id: userId,
                user_name: userName,
                user_firstName: firstName,
                user_lastName: lastName,
                user_avatar: avatar,
                user_coverImage: coverImage,
                user_email: email,
                user_password: password,
            });

            const createdUser = await User.findOne({
                user_id: user.user_id,
            }).select('-refresh_token');

            if (!createdUser) {
                throw new Error('USER_CREATION_DB_ISSUE');
            }
            return createdUser;
        } catch (err) {
            throw err;
        }
    }

    async deleteUser(userId) {
        try {
            const deletedUser = await User.deleteOne({
                user_id: userId,
            })

            if(deletedUser.deletedCount === 0){
                throw new Error("")
            }
        } catch (err) {
            throw err;
        }
    }

    async logoutUser(userId) {
        try {
        } catch (err) {
            throw err;
        }
    }

    async updateRefreshToken(userId, refreshToken) {
        try {
        } catch (err) {
            throw err;
        }
    }

    async getChannelProfile(channelId, currentUserId) {
        try {
        } catch (err) {
            throw err;
        }
    }

    async updateAccountDetails(userId, firstName, lastName, email) {
        try {
        } catch (err) {
            throw err;
        }
    }

    async updateChannelDetails(userId, userName, bio) {
        try {
        } catch (err) {
            throw err;
        }
    }

    async updatePassword(userId, newPassword) {
        try {
        } catch (err) {
            throw err;
        }
    }

    async updateAvatar(userId, avatar) {
        try {
        } catch (err) {
            throw err;
        }
    }

    async updateCoverImage(userId, coverImage) {
        try {
        } catch (err) {
            throw err;
        }
    }

    async getWatchHistory(userId, orderBy, limit, page) {
        try {
        } catch (err) {
            throw err;
        }
    }

    async clearWatchHistory(userId) {
        try {
        } catch (err) {
            throw err;
        }
    }

    async updateWatchHistory(postId, userId) {
        try {
        } catch (err) {
            throw err;
        }
    }
}
