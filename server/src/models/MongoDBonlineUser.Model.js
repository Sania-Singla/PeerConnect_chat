import { IonlineUsers } from '../interfaces/onlineUser.Interface.js';
import { OnlineUser } from '../schemas/index.js';

export class MongoDBonlineUsers extends IonlineUsers {
    async getOnlineUser(userId) {
        try {
            return await OnlineUser.findOne({
                user_id: userId,
                is_online: true,
            }).lean();
        } catch (err) {
            throw err;
        }
    }

    async markUserOnline(userId, socketId) {
        try {
            return await OnlineUser.findOneAndUpdate(
                { user_id: userId },
                {
                    $set: {
                        socket_id: socketId,
                        is_online: true,
                        last_seen: null,
                    },
                },
                { new: true }
            ).lean();
        } catch (err) {
            throw err;
        }
    }

    async markUserOffline(userId) {
        try {
            return await OnlineUser.findOneAndUpdate(
                { user_id: userId },
                {
                    $set: {
                        socket_id: '',
                        is_online: false,
                        last_seen: new Date(),
                    },
                },
                { new: true }
            ).lean();
        } catch (err) {
            throw err;
        }
    }
}
