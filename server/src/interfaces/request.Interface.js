export class Irequests {
    async requestExistance(requestId) {
        throw new Error('requestExistance method not implemented');
    }

    async areWeFriends(myId, userIds = []) {
        throw new Error('areWeFriends method not implemented');
    }

    async sendRequest(myId, userId) {
        throw new Error('sendRequest method not implemented');
    }

    async rejectRequest(requestId) {
        throw new Error('rejectRequest method not implemented');
    }

    async acceptRequest(requestId) {
        throw new Error('acceptRequest method not implemented');
    }

    async getRequests(myId, status) {
        throw new Error('getRequests method not implemented');
    }
}
