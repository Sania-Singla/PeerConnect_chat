import { getServiceObject } from '../db/serviceObjects.js';
import { OK, BAD_REQUEST } from '../constants/errorCodes.js';
import { ErrorHandler, tryCatch } from '../utils/index.js';
import {
    getOtherMembers,
    getSocketId,
    getSocketIds,
} from '../helpers/index.js';
import validator from 'validator';
import { io } from '../socket.js';

export const chatObject = getServiceObject('chats');

// groups also
const getMyChats = tryCatch('get my chats', async (req, res) => {
    const myId = req.user.user_id;
    const chats = await chatObject.getMyChats(myId);

    const transformedChats = chats.map((chat) => {
        const otherMembers = getOtherMembers(chat.members, myId);

        return {
            ...chat,
            chat_name: chat.isGroupChat
                ? chat.chat_name
                : otherMembers[0].user_fullName,
            avatar: chat.isGroupChat
                ? chat.members.slice(0, 3).map(({ user_avatar }) => user_avatar)
                : otherMembers[0].user_avatar,
        };
    });

    return res.status(OK).json(transformedChats);
});

const getChatDetails = tryCatch('get chat details', async (req, res, next) => {
    const { chatId } = req.params;
    const myId = req.user.user_id;
    const chat = req.chat;

    if (!chat.members.find(({ user_id }) => user_id === req.user.user_id)) {
        return next(
            new ErrorHandler('You are not a member of this chat', BAD_REQUEST)
        );
    }

    const populatedChat = await chatObject.getChatDetails(chatId);
    const otherMembers = getOtherMembers(populatedChat.members, myId);

    const transformedChat = {
        ...populatedChat,
        chat_name: populatedChat.isGroupChat
            ? populatedChat.chat_name
            : otherMembers[0].user_fullName,
        avatar: populatedChat.isGroupChat
            ? populatedChat.members
                  .slice(0, 3)
                  .map(({ user_avatar }) => user_avatar)
            : otherMembers[0].user_avatar,
    };
    return res.status(OK).json(transformedChat);
});

const getMyFriends = tryCatch('get my friends', async (req, res) => {
    const friends = await chatObject.getMyFriends(req.user.user_id);
    return res.status(OK).json(friends);
});

const createGroup = tryCatch(
    'creating new group chat',
    async (req, res, next) => {
        const { chatName = '', members = [] } = req.body; // members excluding me
        const myId = req.user.user_id;

        if (!chatName) {
            return next(
                new ErrorHandler(
                    'chat name is required for group chat',
                    BAD_REQUEST
                )
            );
        }

        if (!members.length) {
            return next(
                new ErrorHandler(
                    'atleast 1 more member is required',
                    BAD_REQUEST
                )
            );
        }

        if (members.length > 100) {
            return next(
                new ErrorHandler(
                    'max number of group size allowed is 100',
                    BAD_REQUEST
                )
            );
        }

        if (members.some((userId) => !userId || !validator.isUUID(userId))) {
            return next(
                new ErrorHandler(
                    'missing or invalid userId of a member',
                    BAD_REQUEST
                )
            );
        }

        // you need to be friends with all the members to create a group
        const areFriends = await chatObject.areWeFriends(myId, members);
        if (!areFriends) {
            return next(
                new ErrorHandler(
                    'You can create group with your friends only',
                    BAD_REQUEST
                )
            );
        }

        const transformedMembers = members.concat(myId).map((userId) => ({
            user_id: userId,
            role: userId === myId ? 'admin' : 'member',
        }));

        let chat = await chatObject.createGroup(
            transformedMembers,
            myId, // creator
            chatName
        );

        chat = await chatObject.getChatDetails(chat.chat_id);

        const transformedChat = {
            ...chat,
            avatar: chat.members
                .slice(0, 3)
                .map(({ user_avatar }) => user_avatar),
        };

        const memberIds = transformedMembers.map((m) => m.user_id);
        const socketIds = await getSocketIds(memberIds);

        const sockets = io.sockets.sockets; // This is a Map of socketId => Socket // necause socketId.join() is not a function

        socketIds.forEach((socketId) => {
            const socket = sockets.get(socketId);
            if (socket) {
                socket.join(`chat:${chat.chat_id}`);
                io.to(socketId).emit('newChat', transformedChat);
            }
        });

        return res.status(OK).json(transformedChat);
    }
);

const getMyGroups = tryCatch('get my groups', async (req, res) => {
    const myId = req.user.user_id;
    const chats = await chatObject.getMyGroups(myId);

    const transformedChats = chats.map((chat) => {
        return {
            ...chat,
            avatar: chat.members
                .slice(0, 3)
                .map(({ user_avatar }) => user_avatar),
        };
    });

    return res.status(OK).json(transformedChats);
});

const removeMember = tryCatch(
    'removing a member from group',
    async (req, res, next) => {
        const { chatId, userId } = req.params;
        const chat = req.chat; // middleware
        const myId = req.user.user_id;

        if (!chat.isGroupChat) {
            return next(
                new ErrorHandler(
                    'Cannot remove members from a non-group chat',
                    BAD_REQUEST
                )
            );
        }

        const me = chat.members.find(({ user_id }) => user_id === myId);
        if (!me || me.role !== 'admin') {
            return next(
                new ErrorHandler(
                    'Only admin can remove members from a group',
                    BAD_REQUEST
                )
            );
        }

        const member = chat.members.find(({ user_id }) => user_id === userId);
        if (!member) {
            return next(
                new ErrorHandler(
                    'The user is not a member of this group',
                    BAD_REQUEST
                )
            );
        }

        const result = await chatObject.removeMember(chatId, userId);

        const memberIds = chat.members
            .map((m) => m.user_id)
            .filter((id) => id !== userId);
        const socketIds = await getSocketIds(memberIds);

        const sockets = io.sockets.sockets; // This is a Map of socketId => Socket // necause socketId.join() is not a function

        const socketId = await getSocketId(userId);
        const socket = sockets.get(socketId);
        if (socket) socket.leave(`chat:${chatId}`);

        socketIds.forEach((socketId) => {
            if (socketId) {
                io.to(socketId).emit('memberRemoved', { chatId, userId });
            }
        });

        return res.status(OK).json(result);
    }
);

const makeAdmin = tryCatch('make admin', async (req, res, next) => {
    const { chatId, userId } = req.params;
    const myId = req.user.user_id;
    const chat = req.chat;

    if (!chat.isGroupChat) {
        return next(
            new ErrorHandler(
                'Cannot remove members from a non-group chat',
                BAD_REQUEST
            )
        );
    }

    const me = chat.members.find(({ user_id }) => user_id === myId);
    if (!me || me.role !== 'admin') {
        return next(
            new ErrorHandler(
                'Only an admin can promote someone to admin of the group',
                BAD_REQUEST
            )
        );
    }

    const group = await chatObject.makeAdmin(chatId, userId);

    const memberIds = group.members.map((m) => m.user_id);
    const socketIds = await getSocketIds(memberIds);

    socketIds.forEach((socketId) => {
        if (socketId) {
            io.to(socketId).emit('memberPromoted', { chatId, userId });
        }
    });

    return res.status(OK).json({ message: 'user is now an admin' });
});

const renameGroup = tryCatch('renaming the group', async (req, res, next) => {
    const { chatId } = req.params;
    const { newName } = req.body;
    const chat = req.chat; // middleware

    if (!chat.isGroupChat) {
        return next(
            new ErrorHandler('Cannot rename a non-group chat', BAD_REQUEST)
        );
    }

    const me = chat.members.find(({ user_id }) => user_id === req.user.user_id);
    if (!me || me.role !== 'admin') {
        return next(
            new ErrorHandler('Only admin can rename the group', BAD_REQUEST)
        );
    }

    if (!newName || !newName.trim()) {
        return next(
            new ErrorHandler('New group name cannot be empty', BAD_REQUEST)
        );
    }

    const result = await chatObject.renameGroup(chatId, newName);

    const memberIds = result.members.map((m) => m.user_id);
    const socketIds = await getSocketIds(memberIds);

    socketIds.forEach((socketId) => {
        if (socketId) {
            io.to(socketId).emit('groupRenamed', { chatId, newName });
        }
    });

    return res.status(OK).json(result);
});

const leaveGroup = tryCatch('leave group', async (req, res, next) => {
    const { chatId } = req.params;
    const memberLeaving = req.user.user_id;
    const chat = req.chat; // middleware

    if (!chat.isGroupChat) {
        return next(new ErrorHandler('this is not a group chat', BAD_REQUEST));
    }

    const member = chat.members.find(
        ({ user_id }) => user_id === memberLeaving
    );
    if (!member) {
        return next(
            new ErrorHandler(' you are not a member of this group', BAD_REQUEST)
        );
    }

    if (chat.members.length === 1) {
        const result = await chatObject.deleteChat(chatId);
        const memberIds = result.members.map((m) => m.user_id);
        const socketIds = await getSocketIds(memberIds);

        socketIds.forEach((socketId) => {
            if (socketId) io.to(socketId).emit('chatDeleted', chatId);
        });

        return res.status(OK).json({ message: 'group no longer exists' });
    }

    const result = await chatObject.leaveGroup(chatId, memberLeaving);
    const memberIds = result.members.map((m) => m.user_id);
    const socketIds = await getSocketIds(memberIds.concat(memberLeaving));

    const sockets = io.sockets.sockets; // This is a Map of socketId => Socket // necause socketId.join() is not a function

    const socketId = await getSocketId(memberLeaving);
    const socket = sockets.get(socketId);
    if (socket) socket.leave(`chat:${chatId}`);

    socketIds.forEach((socketId) => {
        if (socketId) {
            io.to(socketId).emit('memberRemoved', {
                chatId,
                userId: memberLeaving,
            });
        }
    });

    return res.status(OK).json(result);
});

const deleteChat = tryCatch('delete chat', async (req, res, next) => {
    const { chatId } = req.params;
    const chat = req.chat; // resource exists middleware

    if (chat.isGroupChat && chat.creator !== req.user.user_id) {
        return next(
            new ErrorHandler(
                'only the creator can delete the group',
                BAD_REQUEST
            )
        );
    }

    await chatObject.deleteChat(chatId);

    const memberIds = chat.members.map((m) => m.user_id);
    const socketIds = await getSocketIds(memberIds);

    socketIds.forEach((socketId) => {
        if (socketId) io.to(socketId).emit('chatDeleted', chatId);
    });

    return res.status(OK).json(chat);
});

const addMembers = tryCatch('add members to group', async (req, res, next) => {
    const { chatId } = req.params;
    const { members = [] } = req.body;
    const chat = req.chat; // middleware
    const myId = req.user.user_id;

    if (!chat.isGroupChat) {
        return next(
            new ErrorHandler(
                'Cannot add members to a non-group chat',
                BAD_REQUEST
            )
        );
    }

    const me = chat.members.find(({ user_id }) => user_id === myId);
    if (!me || me.role !== 'admin') {
        return next(
            new ErrorHandler(
                'Only admin can add members to a group',
                BAD_REQUEST
            )
        );
    }

    if (!members.length) {
        return next(new ErrorHandler('No members selected', BAD_REQUEST));
    }

    if (members.some((id) => !id || !validator.isUUID(id))) {
        return next(
            new ErrorHandler(
                'missing or invalid userId of some member',
                BAD_REQUEST
            )
        );
    }

    const memberIds = chat.members.map(({ user_id }) => user_id);
    const membersToAdd = members.filter((id) => !memberIds.includes(id));

    if (!membersToAdd.length) {
        return next(
            new ErrorHandler(
                'all members are already in the group',
                BAD_REQUEST
            )
        );
    }

    if (memberIds.length + membersToAdd.length > 100) {
        return next(
            new ErrorHandler(
                'max number of group size allowed is 100',
                BAD_REQUEST
            )
        );
    }

    const friends = await chatObject.areWeFriends(myId, membersToAdd);
    if (!friends) {
        return next(
            new ErrorHandler(
                'You can create group with your friends only',
                BAD_REQUEST
            )
        );
    }

    const transformedMembersToAdd = membersToAdd.map((id) => ({
        user_id: id,
        role: 'member',
    }));

    let result = await chatObject.addMembers(chatId, transformedMembersToAdd);
    result = await chatObject.getChatDetails(chatId); // populate the members

    const oldMemberIds = chat.members.map((m) => m.user_id);
    const newSocketIds = await getSocketIds(membersToAdd);
    const oldSocketIds = await getSocketIds(oldMemberIds);

    const sockets = io.sockets.sockets;

    oldSocketIds.forEach((socketId) => {
        if (socketId) {
            io.to(socketId).emit('membersAdded', {
                chatId,
                members: result.members,
            });
        }
    });

    newSocketIds.forEach((socketId) => {
        const socket = sockets.get(socketId);
        if (socket) {
            socket.join(`chat:${chatId}`);
            io.to(socketId).emit('newChat', result);
        }
    });
    return res.status(OK).json(result);
});

export {
    getChatDetails,
    getMyChats,
    getMyFriends,
    getMyGroups,
    addMembers,
    removeMember,
    createGroup,
    leaveGroup,
    deleteChat,
    renameGroup,
    makeAdmin,
};
