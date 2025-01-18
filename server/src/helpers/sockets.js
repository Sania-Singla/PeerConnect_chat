import { redisClient } from '../socket.js';
import { onlineUserObject } from '../controllers/onlineUser.Controller.js';

async function getSocketId(userId) {
    let socketId = await redisClient.get(`user:${userId}`);
    if (!socketId) {
        const user = await onlineUserObject.getOnlineUser(userId);
        if (user) {
            socketId = user.socket_id;
            await redisClient.setEx(userId, 3600, socketId); // set in redis with 1hr exp.
        }
    }
    return socketId;
}

const getOtherMembers = (members = [], userId) => {
    return members.filter(({ user_id }) => user_id !== userId);
};

const getSocketIds = async (userIds = []) => {
    return await Promise.all(userIds.map((id) => getSocketId(id))); // preserving null/falsy values for indexing
};

export { getSocketIds, getSocketId, getOtherMembers };
