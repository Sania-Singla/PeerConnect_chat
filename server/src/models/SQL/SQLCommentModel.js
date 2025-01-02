import { Icomments } from '../../interfaces/comment.Interface.js';
import { connection } from '../../server.js';
import { verifyOrderBy } from '../../utils/index.js';

export class SQLcomments extends Icomments {
    async getComments(postId, currentUserId, orderBy) {
        try {
            const q = `  
                    SELECT 
                        v.*,
                        IFNULL(l.is_liked, -1) AS isLiked    -- -1 for no interaction
                    FROM comment_view v
                    LEFT JOIN comment_likes l 
                    ON v.comment_id = l.comment_id AND l.user_id = ?
                    WHERE v.post_id = ? 
                    ORDER BY v.comment_createdAt ${orderBy.toUpperCase()}
                `;

            const [comments] = await connection.query(q, [
                currentUserId,
                postId,
            ]);

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
                return null;
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

            return await this.getComment(commentId);
        } catch (err) {
            throw err;
        }
    }

    async deleteComment(commentId) {
        try {
            const q = 'DELETE FROM comments WHERE comment_id = ?';
            return await connection.query(q, [commentId]);
        } catch (err) {
            throw err;
        }
    }

    async editComment(commentId, commentContent) {
        try {
            const q =
                'UPDATE comments SET comment_content = ? WHERE comment_id = ?';
            await connection.query(q, [commentContent, commentId]);
            return await this.getComment(commentId);
        } catch (err) {
            throw err;
        }
    }
}
