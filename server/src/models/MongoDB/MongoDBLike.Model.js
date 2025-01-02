import { Ilikes } from '../../interfaces/like.Interface.js';

export class MongoDBlikes extends Ilikes {
    async getLikedPosts(userId, orderBy, limit, page) {
        try {
        } catch (err) {
            throw err;
        }
    }

    async togglePostLike(userId, postId, likedStatus) {
        try {
        } catch (err) {
            throw err;
        }
    }

    async toggleCommentLike(userId, commentId, likedStatus) {
        try {
        } catch (err) {
            throw err;
        }
    }
}
