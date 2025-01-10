import getServiceObject from '../db/serviceObjects.js';
import { SERVER_ERROR, OK, BAD_REQUEST } from '../constants/errorCodes.js';

const groupObject = getServiceObject('groupChats');

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
    createGroup,
    deleteGroup,
    leaveGroup,
    removeSomeoneFromGroup,
    addSomeoneToGroup,
    promoteSomeoneToAdmin,
};
