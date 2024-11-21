import { Ilikes } from '../../interfaces/likeInterface.js';
import { connection } from '../../server.js';
import { verifyOrderBy } from '../../utils/verifyOrderBy.js';

export class Oraclelikes extends Ilikes {
    async getLikedPosts(userId, orderBy, limit, page) {
        try {
            verifyOrderBy(orderBy); // Ensure valid order direction
            const q = `
                BEGIN
                    :result := LIKES_PACKAGE.getLikedPosts(:userId, :orderBy, :limit, :page);
                END;`;

            const result = await connection.execute(q, {
                userId: { val: userId, type: connection.STRING },
                orderBy: { val: orderBy, type: connection.STRING },
                limit: { val: limit, type: connection.NUMBER },
                page: { val: page, type: connection.NUMBER },
                result: { dir: connection.BIND_OUT, type: connection.CURSOR },
            });

            const cursor = result.outBinds.result;
            let posts = await cursor.getRows();
            cursor.close();

            if (!posts.length) {
                return { message: 'NO_LIKED_POSTS' };
            }

            // Assuming the returned data has pagination information
            return posts;
        } catch (err) {
            throw err;
        }
    }

    async togglePostLike(postId, userId, likedStatus) {
        try {
            const q = `
                BEGIN
                    :result := LIKES_PACKAGE.togglePostLike(:postId, :userId, :likedStatus);
                END;`;
            const result = await connection.execute(q, {
                postId: { val: postId, type: connection.NUMBER },
                userId: { val: userId, type: connection.NUMBER },
                likedStatus: { val: likedStatus, type: connection.NUMBER },
                result: { dir: connection.BIND_OUT, type: connection.STRING },
            });
            return result.outBinds.result;
        } catch (err) {
            throw err;
        }
    }

    async toggleCommentLike(commentId, userId, likedStatus) {
        try {
            const q = `
                BEGIN
                    :result := LIKES_PACKAGE.toggleCommentLike(:commentId, :userId, :likedStatus);
                END;`;

            const result = await connection.execute(q, {
                commentId: { val: commentId, type: connection.NUMBER },
                userId: { val: userId, type: connection.NUMBER },
                likedStatus: { val: likedStatus, type: connection.NUMBER },
                result: { dir: connection.BIND_OUT, type: connection.STRING },
            });

            return result.outBinds.result;
        } catch (err) {
            throw err;
        }
    }
}
