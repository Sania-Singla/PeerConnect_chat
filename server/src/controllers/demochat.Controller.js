import { getServiceObject } from '../db/serviceObjects.js';
import { v4 as uuid } from 'uuid';
import { SERVER_ERROR, OK, BAD_REQUEST } from '../constants/errorCodes.js';

export const chatObject = getServiceObject('chats');

const addChat = async (req, res) => {
    try {
        const myId = req.user.user_id;
        const { userId } = req.params;

        // check if chat between these two already exists
        let chat = await chatObject.doesChatAlreadyExist([myId, userId]);
        if (chat) {
            return res
                .status(BAD_REQUEST)
                .json({ message: 'chat already exists' });
        }

        chat = await chatObject.addChat(uuid(), [myId, userId]);

        return res.status(OK).json(chat);
    } catch (err) {
        console.log(err);
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while getting the messages.',
            error: err.message,
        });
    }
};

const deleteChat = async (req, res) => {
    try {
        const { chatId } = req.params;

        await chatObject.deleteChat(chatId);

        return res.status(OK).json({ message: 'chat deleted successfully' });
    } catch (err) {
        console.log(err);
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while getting the messages.',
            error: err.message,
        });
    }
};

const getChats = async (req, res) => {
    try {
        const myId = req.user.user_id;

        const chats = await chatObject.getChats(myId);

        if (chats.length) {
            return res.status(OK).json(chats);
        } else {
            return res.status(OK).json({ message: 'no chats found' });
        }
    } catch (err) {
        console.log(err);
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while getting the chats.',
            error: err.message,
        });
    }
};

const getChat = async (req, res) => {
    try {
        const { chatId } = req.params;
        const myId = req.user.user_id;

        const chat = await chatObject.getChat(chatId, myId);

        return res.status(OK).json(chat);
    } catch (err) {
        console.log(err);
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while getting the chat.',
            error: err.message,
        });
    }
};

const createGroup = async (req, res) => {
    try {
        const myId = req.user.user_id;
        const { memberIds = [], groupName = 'Anonymous' } = req.body;

        if (!Array.isArray(memberIds)) {
            return res
                .status(BAD_REQUEST)
                .json({ message: 'memberIds need to be an array of userIds' });
        }

        const group = await groupObject.createGroup(
            uuid(), //groupId
            groupName,
            myId, // createdBy
            memberIds
        );

        return res.status(OK).json(group);
    } catch (err) {
        console.log(err);
        return res.status(SERVER_ERROR).json({
            message: 'Something went wrong while creating the group',
            error: err.message,
        });
    }
};

const deleteGroup = async (req, res) => {
    try {
        const groupId = req.params;

        // inly delete the group if there are no members in the group

        const { admins, normalMembers } =
            await groupObject.getParticipants(groupId);
        if (admins.length || normalMembers.length) {
            return res
                .status(BAD_REQUEST)
                .json({ message: 'can not delete group with members' });
        } else {
            await groupObject.deleteGroup(groupId);
            return res
                .status(OK)
                .json({ message: 'group deleted successfully' });
        }
    } catch (err) {
        console.log(err);
        return res.status(SERVER_ERROR).json({
            message: 'Something went wrong while deleting the group',
            error: err.message,
        });
    }
};

const leaveGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const myId = req.user.user_id;

        // check if we were the only admin then make someother member as admin and leave
        const { admins, normalMembers } =
            await groupObject.getParticipants(groupId);

        if (admins.length === 1 && admins[0] === myId) {
            if (normalMembers.length) {
                // will have some other members so promote someone to admin
                await groupObject.promoteSomeoneToAdmin(
                    groupId,
                    normalMembers[0]
                );
            }
        }
        await groupObject.leaveGroup(myId, groupId);

        return res.status(OK).json({ message: 'group left successfully' });
    } catch (err) {
        console.log(err);
        return res.status(SERVER_ERROR).json({
            message: 'Something went wrong while leaving the group',
            error: err.message,
        });
    }
};

const removeSomeoneFromGroup = async (req, res) => {
    try {
        const { groupId, userId } = req.params;
        const myId = req.user.user_id;

        // we should be the admin to remove someone from the group and that person should not be an admin
        const admins = await groupObject.getAdmins(groupId);

        if (!admins.includes(myId)) {
            return res.status(BAD_REQUEST).json({
                message: 'only admins can remove members from the group',
            });
        } else if (admins.includes(userId)) {
            return res.status(BAD_REQUEST).json({
                message: 'cannot remove an admin from the group',
            });
        }

        await groupObject.removeSomeoneFromGroup(groupId, userId);

        return res
            .status(OK)
            .json({ message: 'member removed from the group successfully' });
    } catch (err) {
        console.log(err);
        return res.status(SERVER_ERROR).json({
            message:
                'Something went wrong while removing someone from the group',
            error: err.message,
        });
    }
};

const addSomeoneToGroup = async (req, res) => {
    try {
        const { groupId, userId } = req.params;
        const myId = req.user.user_id;

        // check if already a member
        const { admins, normalMembers } =
            await groupObject.getParticipants(groupId);

        if (!admins.includes(userId) && !normalMembers.includes(userId)) {
            await groupObject.addSomeoneToGroup(groupId, userId);
            return res
                .status(OK)
                .json({ message: 'member added to successfully' });
        } else {
            return res.status(BAD_REQUEST).json({
                message: 'already a member of the group',
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(SERVER_ERROR).json({
            message: 'Something went wrong while adding someone to the group',
            error: err.message,
        });
    }
};

const promoteSomeoneToAdmin = async (req, res) => {
    try {
        const myId = req.user.user_id;
        const { userId, groupId } = req.params;

        // we should be an admin to make someone admin
        const admins = await groupObject.getAdmins(groupId);
        if (!admins.includes(myId)) {
            return res.status(BAD_REQUEST).json({
                message: 'only admins can promote other members to admin',
            });
        } else {
            await groupObject.promoteSomeoneToAdmin(groupId, userId);
            return res
                .status(OK)
                .json({ message: 'member promoted to admin successfully' });
        }
    } catch (err) {
        console.log(err);
        return res.status(SERVER_ERROR).json({
            message: 'Something went wrong while promoting someone to admin',
            error: err.message,
        });
    }
};

export {
    addChat,
    deleteChat,
    getChats,
    getChat,
    createGroup,
    deleteGroup,
    leaveGroup,
    removeSomeoneFromGroup,
    addSomeoneToGroup,
    promoteSomeoneToAdmin,
};
