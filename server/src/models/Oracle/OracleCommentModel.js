import { Icomments } from '../../interfaces/commentInterface.js';
import { connection } from '../../server.js';
import { verifyOrderBy } from '../../utils/verifyOrderBy.js';

export class Oraclecomments extends Icomments {
    async getComments(postId, currentUserId, orderBy) {
        try {
            verifyOrderBy(orderBy);

            const q = `  
                BEGIN
                    :result := COMMENT_PACKAGE.getComments(:postId, :currentUserId, :orderBy);
                END;`;

            const result = await connection.execute(q, {
                postId: { val: postId, type: connection.NUMBER },
                currentUserId: { val: currentUserId, type: connection.NUMBER },
                orderBy: {
                    val: orderBy.toUpperCase(),
                    type: connection.STRING,
                },
                result: { dir: connection.BIND_OUT, type: connection.CURSOR }, // Return cursor
            });

            const cursor = result.outBinds.result;
            const comments = await cursor.getRows();
            cursor.close();

            if (comments.length === 0) {
                return { message: 'NO_COMMENTS_FOUND' };
            }

            return comments;
        } catch (err) {
            throw err;
        }
    }

    async getComment(commentId, currentUserId) {
        try {
            const q = `  
                BEGIN
                    :result := COMMENT_PACKAGE.getComment(:commentId, :currentUserId);
                END;`;

            const result = await connection.execute(q, {
                commentId: { val: commentId, type: connection.NUMBER },
                currentUserId: { val: currentUserId, type: connection.NUMBER },
                result: { dir: connection.BIND_OUT, type: connection.CURSOR }, // Return cursor
            });

            const cursor = result.outBinds.result;
            const [[comment]] = await cursor.getRows();
            cursor.close();

            if (!comment) {
                return { message: 'COMMENT_NOT_FOUND' };
            }

            return comment;
        } catch (err) {
            throw err;
        }
    }

    async createComment(commentId, userId, postId, commentContent) {
        try {
            const q = `
                BEGIN
                    :result := COMMENT_PACKAGE.createComment(:commentId, :userId, :postId, :commentContent);
                END;`;

            const result = await connection.execute(q, {
                commentId: { val: commentId, type: connection.NUMBER },
                userId: { val: userId, type: connection.NUMBER },
                postId: { val: postId, type: connection.NUMBER },
                commentContent: {
                    val: commentContent,
                    type: connection.STRING,
                },
                result: { dir: connection.BIND_OUT, type: connection.STRING }, // Return status message
            });

            return result.outBinds.result;
        } catch (err) {
            throw err;
        }
    }

    async deleteComment(commentId) {
        try {
            const q = `
                BEGIN
                    :result := COMMENT_PACKAGE.deleteComment(:commentId);
                END;`;

            const result = await connection.execute(q, {
                commentId: { val: commentId, type: connection.NUMBER },
                result: { dir: connection.BIND_OUT, type: connection.STRING }, // Return status message
            });

            return result.outBinds.result;
        } catch (err) {
            throw err;
        }
    }

    async editComment(commentId, commentContent) {
        try {
            const q = `
                BEGIN
                    :result := COMMENT_PACKAGE.editComment(:commentId, :commentContent);
                END;`;

            const result = await connection.execute(q, {
                commentId: { val: commentId, type: connection.NUMBER },
                commentContent: {
                    val: commentContent,
                    type: connection.STRING,
                },
                result: { dir: connection.BIND_OUT, type: connection.STRING }, // Return status message
            });

            return result.outBinds.result;
        } catch (err) {
            throw err;
        }
    }
}
