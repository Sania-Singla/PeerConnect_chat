export class Icomments {
    async getComments(postId, userId, orderBy) {
        throw new Error('Method getComments not overwritten.');
    }

    async getComment(commentId, userId) {
        throw new Error('Method getComment not overwritten.');
    }

    async createComment(commentId, userId, postId, commentContent) {
        throw new Error('Method createComment not overwritten.');
    }

    async deleteComment(commentId) {
        throw new Error('Method deleteComment not overwritten.');
    }

    async editComment(commentId, commentContent) {
        throw new Error('Method editComment not overwritten.');
    }
}
