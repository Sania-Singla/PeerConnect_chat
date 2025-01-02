import { Iusers } from '../../interfaces/user.Interface.js';
import { User } from '../../schemas/MongoDB/index.js';

export class MongoDBusers extends Iusers {
    async getUser(searchInput) {
        try {
            return await User.findOne({
                $or: [
                    { user_id: searchInput },
                    { user_name: searchInput },
                    { user_email: searchInput },
                ],
            }).select('-user_password -refresh_token');
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

            const { refresh_token, user_password, ...createdUser } = user;
            return createdUser;
        } catch (err) {
            throw err;
        }
    }

    async deleteUser(userId) {
        try {
            return await User.findByIdAndDelete(userId);
        } catch (err) {
            throw err;
        }
    }

    async logoutUser(userId) {
        try {
            return await User.findOneAndUpdate(
                { user_id: userId },
                {
                    $set: {
                        refresh_token: '',
                    },
                },
                {
                    new: true,
                }
            );
        } catch (err) {
            throw err;
        }
    }

    async loginUser(userId, refreshToken) {
        try {
            return await User.findOneAndUpdate(
                { user_id: userId },
                {
                    $set: {
                        refresh_token: refreshToken,
                    },
                },
                {
                    new: true,
                }
            );
        } catch (err) {
            throw err;
        }
    }

    async getChannelProfile(channelId, userId) {
        try {
        } catch (err) {
            throw err;
        }
    }

    async updateAccountDetails({ userId, firstName, lastName, email }) {
        try {
            return await User.findOneAndUpdate(
                { user_id: userId },
                {
                    $set: {
                        user_firstName: firstName,
                        user_lastName: lastName,
                        user_email: email,
                    },
                },
                {
                    new: true,
                }
            ).select('-user_password -refresh_token');
        } catch (err) {
            throw err;
        }
    }

    async updateChannelDetails({ userId, userName, bio }) {
        try {
            return await User.findOneAndUpdate(
                { user_id: userId },
                {
                    $set: {
                        user_name: userName,
                        user_bio: bio,
                    },
                },
                {
                    new: true,
                }
            ).select('-user_password -refresh_token');
        } catch (err) {
            throw err;
        }
    }

    async updatePassword(userId, newPassword) {
        try {
            return await User.findOneAndUpdate(
                { user_id: userId },
                {
                    $set: {
                        user_password: newPassword,
                    },
                },
                {
                    new: true,
                }
            ).select('-user_password -refresh_token');
        } catch (err) {
            throw err;
        }
    }

    async updateAvatar(userId, avatar) {
        try {
            return await User.findOneAndUpdate(
                { user_id: userId },
                {
                    $set: {
                        user_avatar: avatar,
                    },
                },
                {
                    new: true,
                }
            ).select('-user_password -refresh_token');
        } catch (err) {
            throw err;
        }
    }

    async updateCoverImage(userId, coverImage) {
        try {
            return await User.findOneAndUpdate(
                { user_id: userId },
                {
                    $set: {
                        user_coverImage: coverImage,
                    },
                },
                {
                    new: true,
                }
            ).select('-user_password -refresh_token');
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
