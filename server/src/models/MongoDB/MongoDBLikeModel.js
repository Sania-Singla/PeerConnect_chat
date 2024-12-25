import { Ilikes } from '../../interfaces/like.Interface.js';

export class MongoDBlikes extends Ilikes {
    async getLikedPosts(userId, orderBy, limit, page) {
        try {
        } catch (err) {
            throw err;
        }
    }

    async togglePostLike(postId, userId, likedStatus) {
        try {
        } catch (err) {
            throw err;
        }
    }

    async toggleCommentLike(commentId, userId, likedStatus) {
        try {
        } catch (err) {
            throw err;
        }
    }
}
