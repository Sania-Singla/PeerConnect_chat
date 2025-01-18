import { Icomments } from '../../interfaces/comment.Interface.js';
import { connection } from '../../server.js';
import { v4 as uuid } from 'uuid';

export class SQLcomments extends Icomments {
    async getComments(postId, userId, orderBy) {
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

            const [comments] = await connection.query(q, [userId, postId]);

            return comments;
        } catch (err) {
            throw err;
        }
    }

    async getComment(commentId, userId) {
        try {
            const q = 'SELECT * FROM comments WHERE comment_id = ?';
            const [[comment]] = await connection.query(q, [userId, commentId]);
            if (!comment) {
                return null;
            }

            return comment;
        } catch (err) {
            throw err;
        }
    }

    async createComment(userId, postId, commentContent) {
        try {
            const commentId = uuid();
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
