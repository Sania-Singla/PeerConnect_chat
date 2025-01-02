export class Ilikes {
    async getLikedPosts(userId, orderBy, limit, page) {
        throw new Error('Method getLikedPost not overwritten.');
    }

    async togglePostLike(userId, postId, likedStatus) {
        throw new Error('Method togglePostLike not overwritten.');
    }

    async toggleCommentLike(userId, commentId, likedStatus) {
        throw new Error('Method toggleCommentLike not overwritten.');
    }
}
