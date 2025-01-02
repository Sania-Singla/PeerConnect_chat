import { Iusers } from '../../interfaces/user.Interface.js';
import { User } from '../../schemas/MongoDB/index.js';

export class MongoDBusers extends Iusers {
     try {
       async getUser(searchInput) {
        const user = await User.findOne({
            $or: [
                { user_id: searchInput },
                { user_name: searchInput },
                { user_email: searchInput },
            ],
        }).select('-user_password -refresh_token');

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
            }).select('-user_password -refresh_token');

            return user;
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
            await User.findByIdAndDelete(userId);
        } catch (err) {
            throw err;
        }
    }

    async logoutUser(userId) {
        try {
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                {
                    $set: {
                        refresh_token: '',
                    },
                },
                {
                    new: true,
                }
            ).select('-user_password -refresh_token');

            return updatedUser;
        } catch (err) {
            throw err;
        }
    }

    async updateRefreshToken(userId, refreshToken) {
        try {
    async loginUser(userId, refreshToken) {
        try {
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                {
                    $set: {
                        refresh_token: refreshToken,
                    },
                },
                {
                    new: true,
                }
            ).select('-user_password -refresh_token');

            return updatedUser;
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
            const updatedUser = await User.findByIdAndUpdate(
                userId,
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

            return updatedUser;
        } catch (err) {
            throw err;
        }
    }

    async updateChannelDetails(userId, userName, bio) {
        try {
            const updatedUser = await User.findByIdAndUpdate(
                userId,
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

            return updatedUser;
        } catch (err) {
            throw err;
        }
    }

    async updatePassword(userId, newPassword) {
        try {
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                {
                    $set: {
                        user_password: newPassword,
                    },
                },
                {
                    new: true,
                }
            ).select('-user_password -refresh_token');

            return updatedUser;
        } catch (err) {
            throw err;
        }
    }

    async updateAvatar(userId, avatar) {
        try {
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                {
                    $set: {
                        user_avatar: avatar,
                    },
                },
                {
                    new: true,
                }
            ).select('-user_password -refresh_token');

            return updatedUser;
        } catch (err) {
            throw err;
        }
    }

    async updateCoverImage(userId, coverImage) {
        try {
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                {
                    $set: {
                        user_coverImage: coverImage,
                    },
                },
                {
                    new: true,
                }
            ).select('-user_password -refresh_token');

            return updatedUser;
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
