export class Ilikes {
    async getLikedPosts(userId, orderBy, limit) {
        throw new Error('Method getLikedPost not overwritten.');
    }

    async togglePostLike(postId, userId, likedStatus) {
        throw new Error('Method togglePostLike not overwritten.');
    }

    async toggleCommentLike(commentId, userId, likedStatus) {
        throw new Error('Method toggleCommentLike not overwritten.');
    }

    async toggleNoteVote(noteId, userId, voteStatus) {
        throw new Error('Method toggleNoteVote not overwritten.');
    }
}
