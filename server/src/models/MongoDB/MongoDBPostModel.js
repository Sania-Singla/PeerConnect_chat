import { Iposts } from '../../interfaces/post.Interface.js';

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
        } catch (err) {
            throw err;
        }
    }

    async deletePost(postId) {
        try {
        } catch (err) {
            throw err;
        }
    }

    async updatePostViews(postId, userIdentifier) {
        try {
        } catch (err) {
            throw err;
        }
    }

    async updatePostDetails(postId, title, content, category, updatedAt) {
        try {
        } catch (err) {
            throw err;
        }
    }

    async updatePostImage(postId, image, updatedAt) {
        try {
        } catch (err) {
            throw err;
        }
    }

    async togglePostVisibility(postId, visibility) {
        try {
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
