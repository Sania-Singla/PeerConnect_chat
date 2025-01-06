import { IGroupChats } from '../../interfaces/groupChat.Interface.js';
import {
    GroupChat,
    GroupMessage,
    GroupParticipant,
} from '../../schemas/MongoDB/index.js';

export class MongoGroupChats extends IGroupChats {
    async createGroup(groupId, groupName, createdBy, memberIds) {
        try {
        } catch (err) {
            throw err;
        }
    }

    async leaveGroup(groupId, myId) {
        try {
        } catch (err) {
            throw err;
        }
    }

    // need for brain stroming
    async deleteGroup(groupId) {
        try {
        } catch (err) {
            throw err;
        }
    }

    async getParticipants(groupId) {
        try {
        } catch (err) {
            throw err;
        }
    }

    async getAdmins(groupId) {
        try {
        } catch (err) {
            throw err;
        }
    }

    async getNormalMembers(groupId) {
        try {
        } catch (err) {
            throw err;
        }
    }

    async removeSomeoneFromGroup(groupId, userId) {
        try {
        } catch (err) {
            throw err;
        }
    }

    async addSomeoneToGroup(groupId, userId) {
        try {
        } catch (err) {
            throw err;
        }
    }

    async promoteSomeoneToAdmin(groupId, userId) {
        try {
        } catch (err) {
            throw err;
        }
    }
}
