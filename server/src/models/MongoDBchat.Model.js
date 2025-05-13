import {
    deleteFromCloudinary,
    getPipeline2,
    getSocketIds,
} from '../helpers/index.js';
import { Ichats } from '../interfaces/chat.Interface.js';
import { Attachment, Chat, Message } from '../schemas/index.js';

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
                        members: {
                            $all: [
                                { $elemMatch: { user_id: myId } },
                                { $elemMatch: { user_id: userId } },
                            ],
                        },
                    }).lean()
                )
            );

            // Check if there's any `null` or `undefined` chat, meaning you don't have a chat with that user
            const friendsWithAll = chats.every((chat) => chat);
            return friendsWithAll;
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

    async getChatDetails(chatId) {
        try {
            const pipeline2 = getPipeline2();
            const pipeline = [{ $match: { chat_id: chatId } }, ...pipeline2];

            const [chat] = await Chat.aggregate(pipeline);

            // add isOnline property to members
            const memberIds = chat.members.map(({ user_id }) => user_id);
            const socketIds = await getSocketIds(memberIds);
            return {
                ...chat,
                members: chat.members.map((m, i) => ({
                    ...m,
                    isOnline: !!socketIds[i],
                })),
            };
        } catch (err) {
            throw err;
        }
    }

    async getMyGroups(myId) {
        try {
            const pipeline2 = getPipeline2();
            const pipeline = [
                {
                    $match: { 'members.user_id': myId, isGroupChat: true },
                },
                ...pipeline2,
            ];

            return await Chat.aggregate(pipeline);
        } catch (err) {
            throw err;
        }
    }

    // groups also
    async getMyChats(myId) {
        try {
            const pipeline2 = getPipeline2();
            const pipeline = [
                { $match: { 'members.user_id': myId } },
                ...pipeline2,
            ];

            const chats = await Chat.aggregate(pipeline);

            // add isOnline property to members
            return await Promise.all(
                chats.map(async (chat) => {
                    const memberIds = chat.members.map(
                        ({ user_id }) => user_id
                    );
                    const socketIds = await getSocketIds(memberIds);
                    return {
                        ...chat,
                        members: chat.members.map((m, i) => {
                            return { ...m, isOnline: !!socketIds[i] };
                        }),
                    };
                })
            );
        } catch (err) {
            throw err;
        }
    }

    async getMyFriends(myId) {
        try {
            const pipeline = [
                { $match: { 'members.user_id': myId, isGroupChat: false } },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'members.user_id',
                        foreignField: 'user_id',
                        as: 'members',
                    },
                },
                { $unwind: '$members' },
                { $match: { 'members.user_id': { $ne: myId } } },
                {
                    $project: {
                        user_id: '$members.user_id',
                        user_firstName: '$members.user_firstName',
                        user_lastName: '$members.user_lastName',
                        user_name: '$members.user_name',
                        user_avatar: '$members.user_avatar',
                        user_bio: '$members.user_bio',
                    },
                },
            ];

            return await Chat.aggregate(pipeline);
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

    async makeAdmin(chatId, userId) {
        try {
            return await Chat.findOneAndUpdate(
                {
                    chat_id: chatId,
                    'members.user_id': userId,
                },
                { $set: { 'members.$.role': 'admin' } },
                { new: true }
            ).lean();
        } catch (err) {
            throw err;
        }
    }

    async leaveGroup(chatId, userId) {
        const chat = await Chat.findOneAndUpdate(
            { chat_id: chatId },
            { $pull: { members: { user_id: userId } } },
            { new: true }
        );

        const hasAdmin = chat.members.some(({ role }) => role === 'admin');

        if (!hasAdmin) chat.members[0].role = 'admin';

        await chat.save();
        return chat.toObject();
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

    async deleteChat(chatId) {
        const chat = await Chat.findOneAndDelete({ chat_id: chatId }).lean();

        const messages = await Message.find({ chat_id: chatId }).lean();

        await Message.deleteMany({ chat_id: chatId });

        // Extract all attachment publicIds (flattened if needed)
        const attachmentPublicIds = messages.flatMap(
            (m) => m.attachments || []
        );

        const attachments = await Attachment.find({
            publicId: { $in: attachmentPublicIds },
        }).lean();

        await Attachment.deleteMany({ publicId: { $in: attachmentPublicIds } });

        await Promise.all(
            attachments.map(async (a) => await deleteFromCloudinary(a.url))
        );

        return chat;
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
}
