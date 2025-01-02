import { Ifollowers } from '../../interfaces/follower.Interface.js';
import { connection } from '../../server.js';

export class SQLfollowers extends Ifollowers {
    async getFollowers(channelId) {
        try {
            const q1 =
                '(SELECT COUNT(follower_id) FROM followers f1 WHERE f1.following_id = f.follower_id) AS totalFollowers';
            const q = `
                SELECT 
                    u.user_id, 
                    u.user_name, 
                    u.user_firstName, 
                    u.user_lastName, 
                    user_avatar, 
                    ${q1} 
                FROM followers f, users u 
                WHERE f.follower_id = u.user_id AND f.following_id = ?
                `;

            const [response] = await connection.query(q, [channelId]);

            return response;
        } catch (err) {
            throw err;
        }
    }

    async getFollowings(channelId) {
        try {
            const q1 =
                '(SELECT COUNT(follower_id) FROM followers f1 WHERE f1.following_id = f.following_id) AS totalFollowers';
            const q = `
                SELECT 
                    u.user_id, 
                    u.user_name, 
                    u.user_firstName, 
                    u.user_lastName, 
                    user_avatar, 
                    ${q1} 
                    FROM followers f, users u 
                    WHERE f.following_id = u.user_id AND f.follower_id = ?
                `;

            const [response] = await connection.query(q, [channelId]);
            return response;
        } catch (err) {
            throw err;
        }
    }

    async toggleFollow(channelId, userId) {
        try {
            const q = 'CALL toggleFollow(?, ?)';
            return await connection.query(q, [channelId, userId]);
        } catch (err) {
            throw err;
        }
    }
}
