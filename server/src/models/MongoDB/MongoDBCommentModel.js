import { Icomments } from '../../interfaces/comment.Interface.js';

export class MongoDBcomments extends Icomments {
    async getComments(postId, currentUserId, orderBy) {
        try {
        } catch (err) {
            throw err;
        }
    }

    // only for checking if that comment exists or not
    async getComment(commentId, currentUserId) {
        try {
        } catch (err) {
            throw err;
        }
    }

    async createComment(commentId, userId, postId, commentContent) {
        try {
        } catch (err) {
            throw err;
        }
    }

    async deleteComment(commentId) {
        try {
        } catch (err) {
            throw err;
        }
    }

    async editComment(commentId, commentContent) {
        try {
        } catch (err) {
            throw err;
        }
    }
}
