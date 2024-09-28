import { Ifollowers } from "../interfaces/followerInterface.js";
import { connection } from "../server.js";

export class SQLfollowers extends Ifollowers {
    async getFollowers(channelId) {
        try {
            const q1 = "(SELECT COUNT(follower_id) FROM followers f1 WHERE f1.following_id = f.follower_id) AS totalFollowers";
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
            throw new Error(err);
        }
    }

    async getFollowings(channelId) {
        try {
            const q1 = "(SELECT COUNT(follower_id) FROM followers f1 WHERE f1.following_id = f.following_id) AS totalFollowers";
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
            throw new Error(err);
        }
    }

    async toggleFollow(userId, channelId) {
        try {
            // const q1 = "SELECT COUNT(*) AS isFollowed FROM followers f WHERE f.follower_id = ? AND f.following_id = ?";
            // const [[{ isFollowed }]] = await connection.query(q1, [userId, channelId]);

            // if (isFollowed) {
            //     const q2 = "DELETE FROM followers f WHERE f.follower_id = ? AND f.following_id = ?";
            //     const [response] = await connection.query(q2, [userId, channelId]);
            //     if (response.affectedRows === 0) {
            //         throw new Error({ message: "DELETION_FOLLOWER_RECORD_DB_ISSUE" });
            //     }
            //     return { message: "UNFOLLOWED_SUCCESSFULLY" };
            // }

            // const q2 = "INSERT INTO followers (follower_id, following_id) VALUES(?, ?)";
            // await connection.query(q2, [userId, channelId]);

            // const q3 = "SELECT * FROM followers f WHERE f.follower_id = ? AND f.following_id = ?";
            // const [[response]] = await connection.query(q3, [userId, channelId]);
            // if (!response) {
            //     throw new Error({ message: "FOLLOWING_RECORD_CREATION_DB_ISSUE" });
            // }

            // using PL/SQL Procedures 
            const q = "CALL toggleFollow(?, ?)";
            const [[[response]]] = await connection.query(q, [channelId, userId]);
            return response;
        } catch (err) {
            throw new Error(err);
        }
    }
}
