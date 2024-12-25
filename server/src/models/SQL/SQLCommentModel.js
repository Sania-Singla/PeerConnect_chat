import { Icomments } from '../../interfaces/comment.Interface.js';
import { connection } from '../../server.js';
import { verifyOrderBy } from '../../utils/verifyOrderBy.js';

export class SQLcomments extends Icomments {
    async getComments(postId, currentUserId, orderBy) {
        try {
            verifyOrderBy(orderBy);

            const q = `  
                    SELECT 
                        v.*,
                        IFNULL(l.is_liked, -1) AS isLiked    -- -1 for no interaction
                    FROM comment_view v
                    LEFT JOIN comment_likes l 
                    ON v.comment_id = l.comment_id AND l.user_id = ?
                    WHERE v.post_id = ? 
                    ORDER BY v.comment_createdAt ${orderBy.toUpperCase()};
                `;

            const [comments] = await connection.query(q, [
                currentUserId,
                postId,
            ]);
            if (!comments?.length) {
                return { message: 'no comments found' };
            }

            return comments;
        } catch (err) {
            throw err;
        }
    }

    // only for checking if that comment exists or not
    async getComment(commentId, currentUserId) {
        try {
            const q = `  
                    SELECT 
                        v.*,
                        IFNULL(l.is_liked, -1) AS isLiked
                    FROM comment_view v
                    LEFT JOIN comment_likes l 
                    ON v.comment_id = l.comment_id AND l.user_id = ? 
                    WHERE v.comment_id = ?  
                `;
            const [[comment]] = await connection.query(q, [
                currentUserId,
                commentId,
            ]);
            if (!comment) {
                return { message: 'comment not found' };
            }

            return comment;
        } catch (err) {
            throw err;
        }
    }

    async createComment(commentId, userId, postId, commentContent) {
        try {
            const q =
                'INSERT INTO comments(comment_id, user_id, post_id, comment_content) VALUES (?, ?, ?, ?)';
            await connection.query(q, [
                commentId,
                userId,
                postId,
                commentContent,
            ]);

            const comment = await this.getComment(commentId);
            if (comment?.message) {
                throw new Error('comment creation db issue');
            }
            return comment;
        } catch (err) {
            throw err;
        }
    }

    async deleteComment(commentId) {
        try {
            const q = 'DELETE FROM comments WHERE comment_id = ?';
            const [response] = await connection.query(q, [commentId]);
            if (response.affectedRows === 0) {
                throw new Error('comment deletion db issue');
            }
            return { message: 'comment deleted' };
        } catch (err) {
            throw err;
        }
    }

    async editComment(commentId, commentContent) {
        try {
            const q =
                'UPDATE comments SET comment_content = ? WHERE comment_id = ?';
            await connection.query(q, [commentContent, commentId]);
            const comment = await this.getComment(commentId);
            if (comment?.message) {
                throw new Error('comment updation db issue');
            }
            return comment;
        } catch (err) {
            throw err;
        }
    }
}
