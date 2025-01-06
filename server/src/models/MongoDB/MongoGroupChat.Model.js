import { IGroupChats } from '../../interfaces/groupChat.Interface.js';
import {
    GroupChat,
    GroupMessage,
    GroupParticipant,
} from '../../schemas/MongoDB/index.js';

export class MongoGroupChats extends IGroupChats {
    async addCollaboration(colabId, myId, otherUserId) {
        try {
        } catch (err) {
            throw err;
        }
    }

    // need for brain stroming
    async removeCollaboration(colabId) {
        try {
        } catch (err) {
            throw err;
        }
    }

    async createGroup(admin, normalMembers, colabId) {
        try {
        } catch (err) {
            throw err;
        }
    }

    async leaveGroup(colabId, userId) {
        try {
        } catch (err) {
            throw err;
        }
    }

    // need for brain stroming
    async deleteGroup(colabId) {
        try {
        } catch (err) {
            throw err;
        }
    }

    async removeSomeoneFromGroup(colabId, userId) {
        try {
        } catch (err) {
            throw err;
        }
    }

    async addSomeoneToGroup(colabId, userId) {
        try {
        } catch (err) {
            throw err;
        }
    }

    async promoteToAdmin(colabId, userId) {
        try {
        } catch (err) {
            throw err;
        }
    }
}
