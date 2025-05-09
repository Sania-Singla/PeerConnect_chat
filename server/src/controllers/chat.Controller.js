import { getServiceObject } from '../db/serviceObjects.js';
import { OK, BAD_REQUEST } from '../constants/errorCodes.js';
import { ErrorHandler, tryCatch } from '../utils/index.js';
import { getOtherMembers } from '../helpers/index.js';
import validator from 'validator';

export const chatObject = getServiceObject('chats');

// groups also
const getMyChats = tryCatch('get my chats', async (req, res) => {
    const myId = req.user.user_id;
    const chats = await chatObject.getMyChats(myId);

    const transformedChats = chats.map((chat) => {
        const otherMembers = getOtherMembers(chat.members, myId);

        return {
            ...chat,
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
        avatar: populatedChat.isGroupChat
            ? populatedChat.members
                  .slice(0, 3)
                  .map(({ user_avatar }) => user_avatar)
            : otherMembers[0].user_avatar,
    };
    return res.status(OK).json(transformedChat);
});

//! *********************************PENDING
//! *********************************PENDING
//! *********************************PENDING
//! *********************************PENDING
//! *********************************PENDING
//! *********************************PENDING
//! *********************************PENDING
//! *********************************PENDING
//! *********************************PENDING
//! *********************************PENDING
//! *********************************PENDING
//! *********************************PENDING
//! *********************************PENDING
//! *********************************PENDING
//! *********************************PENDING
//! *********************************PENDING
//! *********************************PENDING
//! *********************************PENDING
//! *********************************PENDING
//! *********************************PENDING
//! *********************************PENDING
//! *********************************PENDING
//! *********************************PENDING
//! *********************************PENDING

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
const getMyFriends = tryCatch('get my friends', async (req, res) => {
    const myId = req.user.user_id;
    const friends = await chatObject.getMyFriends(myId);
    return res.status(OK).json(friends);
});

const createGroup = tryCatch(
    'creating new group chat',
    async (req, res, next) => {
        const { chatName = '', members = [] } = req.body; // members excluding me
        const myId = req.user.user_id;

        // todo: check if chat between these members already exists

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

        const chat = await chatObject.createGroup(
            transformedMembers,
            myId, // creator
            chatName
        );

        // todo: Socket.io event to update chats on sidebar

        return res.status(OK).json(chat);
    }
);

// ****PENDING************************************************************

// todo: delete all its messages along with attachments
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

    // todo: emit event to refetch chats
    return res.status(OK).json({ message: 'chat has been deleted' });
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
        await chatObject.deleteChat(chatId);
        return res.status(OK).json({ message: 'group no longer exists' });
    }

    const result = await chatObject.leaveGroup(chatId, memberLeaving);

    // todo: socket emit inform other about what user left the group

    return res.status(OK).json(result);
});

// todo: populate the member before sending the response and update the chat avatar as well
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

    if (chat.creator !== myId) {
        return next(
            new ErrorHandler(
                'Only the creator can add members to the group',
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

    const result = await chatObject.addMembers(chatId, transformedMembersToAdd);

    // TODO: Emit socket event to notify members of the updated group (refetch chats maybe for them)

    return res.status(OK).json(result);
});

// can use array to remove multiple members in a single go
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
        if (!me) {
            return next(
                new ErrorHandler(
                    'You are not the member of this group',
                    BAD_REQUEST
                )
            );
        }

        if (me.role !== 'admin') {
            return next(
                new ErrorHandler(
                    'Only an admin can remove members from the group',
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

        // TODO: Emit socket event to notify remaining members about the removal
        return res.status(OK).json(result);
    }
);

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
    if (!me) {
        return next(
            new ErrorHandler('You are not a member of this group', BAD_REQUEST)
        );
    }

    if (me.role !== 'admin') {
        return next(
            new ErrorHandler('Only an admin can rename the group', BAD_REQUEST)
        );
    }

    if (!newName || !newName.trim()) {
        return next(
            new ErrorHandler('New group name cannot be empty', BAD_REQUEST)
        );
    }

    const result = await chatObject.renameGroup(chatId, newName);

    // TODO: Emit socket event to notify members about the group name change
    return res.status(OK).json(result);
});

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
    if (!me) {
        return next(
            new ErrorHandler(
                'You are not the member of this group',
                BAD_REQUEST
            )
        );
    }

    if (me.role !== 'admin') {
        return next(
            new ErrorHandler(
                'Only an admin can promote someone to admin of the group',
                BAD_REQUEST
            )
        );
    }

    const group = await chatObject.makeAdmin(chatId, userId);

    return res.status(OK).json({ message: 'user is now an admin' });
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
