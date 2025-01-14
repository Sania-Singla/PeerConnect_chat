import { getPipeline3 } from '../../helpers/index.js';
import { Ichats } from '../../interfaces/chat.Interface.js';
import { Chat } from '../../schemas/MongoDB/index.js';

export class MongoDBchats extends Ichats {
    async chatExistance(chatId) {
        try {
            return await Chat.findOne({ chat_id: chatId }).lean();
        } catch (err) {
            throw err;
        }
    }

    async areWeFriends(myId, userIds = []) {
        try {
            const chats = await Promise.all(
                userIds.map((userId) =>
                    Chat.findOne({
                        isGroupChat: false,
                        $and: [
                            {
                                members: {
                                    $elemMatch: { user_id: myId }, // Ensure myId exists in the members array
                                },
                            },
                            {
                                members: {
                                    $elemMatch: { user_id: userId }, // Ensure userId exists in the members array
                                },
                            },
                        ],
                    }).lean()
                )
            );

            // Check if there's any `null` or `undefined` chat, meaning you don't have a chat with that user
            const notFriends = chats.some((chat) => !chat);

            if (notFriends) {
                return false; // Means there is at least one user you're not friends with (no one-on-one chat)
            }

            return true; // All members have a chat with you (friends)
        } catch (err) {
            throw err;
        }
    }

    async createGroup(members, creator, chatName) {
        const groupChat = await Chat.create({
            creator,
            members,
            isGroupChat: true,
            chat_name: chatName,
        });

        return groupChat.toObject();
    }

    async deleteChat(chatId) {
        return await Chat.findOneAndDelete({ chat_id: chatId }).lean();
    }

    async leaveGroup(chatId, userId) {
        const chat = await Chat.findOneAndUpdate(
            { chat_id: chatId },
            { $pull: { members: { user_id: userId } } },
            { new: true }
        );

        const hasAdmin = chat.members.some(({ role }) => role === 'admin');

        if (!hasAdmin) {
            chat.members[0].role = 'admin';
        }

        await chat.save();
        return chat.toObject();
    }

    async addMembers(chatId, membersToAdd) {
        try {
            return await Chat.findOneAndUpdate(
                { chat_id: chatId },
                { $push: { members: { $each: membersToAdd } } },
                { new: true }
            ).lean();
        } catch (err) {
            throw err;
        }
    }

    async removeMember(chatId, userId) {
        try {
            return await Chat.findOneAndUpdate(
                { chat_id: chatId },
                { $pull: { members: { user_id: userId } } },
                { new: true }
            ).lean();
        } catch (err) {
            throw err;
        }
    }

    async renameGroup(chatId, newName) {
        try {
            return await Chat.findOneAndUpdate(
                { chat_id: chatId },
                { $set: { chat_name: newName } },
                { new: true }
            ).lean();
        } catch (err) {
            throw err;
        }
    }

    async getChatDetails(chatId) {
        try {
            const pipeline3 = getPipeline3();
            const pipeline = [
                {
                    $match: { chat_id: chatId },
                },
                ...pipeline3,
            ];

            const [chat] = await Chat.aggregate(pipeline);
            return chat;
        } catch (err) {
            throw err;
        }
    }

    async getMyGroups(myId) {
        try {
            const pipeline3 = getPipeline3();
            const pipeline = [
                {
                    $match: { 'members.user_id': myId, isGroupChat: true },
                },
                ...pipeline3,
            ];

            return await Chat.aggregate(pipeline);
        } catch (err) {
            throw err;
        }
    }

    async getMyChats(myId) {
        try {
            const pipeline3 = getPipeline3();
            const pipeline = [
                {
                    $match: { 'members.user_id': myId },
                },
                ...pipeline3,
            ];

            return await Chat.aggregate(pipeline);
        } catch (err) {
            throw err;
        }
    }

    async makeAdmin(chatId, userId) {
        try {
            return await Chat.findOneAndUpdate(
                {
                    chat_id: chatId,
                    isGroupChat: true,
                    'members.user_id': userId,
                },
                { $set: { 'members.$.role': 'admin' } },
                { new: true }
            ).lean();
        } catch (err) {
            throw err;
        }
    }
}
