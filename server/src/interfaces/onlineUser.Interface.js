export class IonlineUsers {
    async getOnlineUser(userId, onlineStatus) {
        throw new Error('Method getOnlineUser is not overwritten');
    }

    async markUserOnline(userId) {
        throw new Error('Method markUserOnline is not overwritten');
    }

    async markUserOffline(userId) {
        throw new Error('Method markUserOffline is not overwritten');
    }
}
