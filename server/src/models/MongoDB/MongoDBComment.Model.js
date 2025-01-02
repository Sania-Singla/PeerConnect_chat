import { Icomments } from '../../interfaces/comment.Interface.js';
import { Comment } from '../../schemas/MongoDB/index.js';

export class MongoDBcomments extends Icomments {
    async getComments(postId, currentUserId, orderBy) {
        try {
            if (orderBy === 'DESC') orderBy = -1;
            else if (orderBy === 'ASC') orderBy = 1;
            else return { message: 'INVALID_ORDERBY' };

            const comments = await Comment.aggregate({
                $match: {
                    post_id: postId,
                },

                $lookup: {
                    from: 'users',
                    localFields: 'user_id',
                    foreignFields: 'user_id',
                    as: 'userDetails',
                },

                $unwind: {
                    path: '$userDetails',
                    preserveNullAndEmptyArrays: true,
                },

                $lookup: {
                    from: 'commentlikes',
                    localFields: 'post_id',
                    foreignFields: 'post_id',
                    as: 'post',
                },
            });

            if (!comments.length) {
                return { message: 'COMMENTS_NOT_FOUND' };
            }

            return comments;


export class MongoDBcomments extends Icomments {
    async getComments(postId, currentUserId, orderBy) {
        try {
 } catch (err) {
            throw err;
        }
    }

    //no need
    // only for checking if that comment exists or not
    async getComment(commentId, currentUserId) {
        try {
            const comment = await Comment.findOne({
                comment_id: commentId,
                user_id: currentUserId,
            });
    // only for checking if that comment exists or not
    async getComment(commentId, currentUserId) {
        try {
        } catch (err) {
            throw err;
        }
    }

    async createComment(commentId, userId, postId, commentContent) {
        try {
            const comment = await Comment.create({
                comment_id: commentId,
                user_id: userId,
                post_id: postId,
                comment_content: commentContent,
            });

            const createdComment = await Comment.findOne
            if (!comment) {
                return { message: 'COMMENT_NOT_FOUND' };
            }
            return comment;
        } catch (err) {
            throw err;
        }
    }

    async deleteComment(commentId) {
        try {
            const deletedComment = await Comment.deleteOne({
                comment_id: commentId,
            });
            //better to check whether deletion done or not, bcz deletedcomment hai ke nahi is check already in controller!//check in category part
            if (deletedComment.deletedCount === 0) {
                throw new Error('COMMENT_DELETION_DB_ISSUE');
            }
            //msg same as in frontend
            return { message: 'COMMENT_DELETED_SUCCESSFULLY DELETED' };
        } catch (err) {
            throw err;
        }
    }

    async editComment(commentId, commentContent) {
        try {
            const updatedComment = await Comment.updateOne(
                { comment_id: commentId },
                {
                    $set: {
                        comment_content: commentContent,
                    },
                },
                { new: true }
            );

            return updatedComment;
        } catch (err) {
            throw err;
        }
    }
}
