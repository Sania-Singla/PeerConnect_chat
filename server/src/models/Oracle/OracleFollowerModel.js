import { Ifollowers } from '../../interfaces/followerInterface.js';
import { connection } from '../../server.js';

export class Oraclefollowers extends Ifollowers {
    async getFollowers(channelId) {
        try {
            const q = `
                BEGIN
                    :result := FOLLOWER_PACKAGE.getFollowers(:channelId);
                END;`;

            const result = await connection.execute(q, {
                channelId: { val: channelId, type: connection.NUMBER },
                result: { dir: connection.BIND_OUT, type: connection.CURSOR }, // BIND_OUT for cursor result
            });

            const cursor = result.outBinds.result;
            const followers = await cursor.getRows();
            cursor.close();

            return followers;
        } catch (err) {
            throw err;
        }
    }

    async getFollowings(channelId) {
        try {
            const q = `
                BEGIN
                    :result := FOLLOWER_PACKAGE.getFollowings(:channelId);
                END;`;

            const result = await connection.execute(q, {
                channelId: { val: channelId, type: connection.NUMBER },
                result: { dir: connection.BIND_OUT, type: connection.CURSOR }, // BIND_OUT for cursor result
            });

            const cursor = result.outBinds.result;
            const followings = await cursor.getRows();
            cursor.close();

            return followings;
        } catch (err) {
            throw err;
        }
    }

    async toggleFollow(userId, channelId) {
        try {
            const q = `
                BEGIN
                    :result := FOLLOWER_PACKAGE.toggleFollow(:channelId, :userId);
                END;`;

            const result = await connection.execute(q, {
                userId: { val: userId, type: connection.NUMBER },
                channelId: { val: channelId, type: connection.NUMBER },
                result: { dir: connection.BIND_OUT, type: connection.STRING }, // BIND_OUT for return value
            });

            return result.outBinds.result;
        } catch (err) {
            throw err;
        }
    }
}
