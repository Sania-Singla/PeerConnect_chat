import { Iusers } from '../../interfaces/user.Interface.js';
import validator from 'validator';

export class MongoDBusers extends Iusers {
    async getUser(searchInput) {
        try {
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
        } catch (err) {
            throw err;
        }
    }

    async deleteUser(userId) {
        try {
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

    async loginUser(userId, refreshToken) {
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
