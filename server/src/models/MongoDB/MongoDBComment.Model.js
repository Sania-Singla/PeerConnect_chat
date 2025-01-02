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
        } catch (err) {
            throw err;
        }
    }

    async getComment(commentId, currentUserId) {
        try {
            return await Comment.findOne({
                comment_id: commentId,
                user_id: currentUserId,
            });
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
