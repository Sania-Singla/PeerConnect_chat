import getServiceObject from '../db/serviceObjects.js';
import { SERVER_ERROR, OK, BAD_REQUEST } from '../constants/errorCodes.js';

const colabObject = getServiceObject('groupChats');

const addCollaboration = async (req, res) => {
    try {
        const { userId } = req.params;
        const myId = req.user.user_id;

        const colab = await colabObject.addCollaboration(
            uuid(), //colabId
            myId,
            userId
        );

        return res.status(OK).json(colab);
    } catch (err) {
        console.log(err);
        return res.status(SERVER_ERROR).json({
            message: 'Something went wrong while adding the collaboration',
            error: err.message,
        });
    }
};

// what happens on other side
const removeCollaboration = async (req, res) => {
    try {
        const { colabId } = req.params;

        await colabObject.removeCollaboration(colabId);

        return res.status(OK).json({
            message: 'collaboration removed successfully',
        });
    } catch (err) {
        console.log(err);
        return res.status(SERVER_ERROR).json({
            message: 'Something went wrong while removing the collaboration',
            error: err.message,
        });
    }
};

const createGroup = async (req, res) => {
    try {
        const { members = [] } = req.body;
        const myId = req.user.user_id;
        const colabId = uuid();

        if (!Array.isArray(members)) {
            return res
                .status(BAD_REQUEST)
                .json({ messages: 'members need to be sent as an array' });
        }

        const group = await colabObject.createGroup(
            myId, // admin
            members,
            colabId
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
        const { colabId } = req.params;

        await colabObject.deleteGroup(colabId);

        return res.status(OK).json({
            message: 'group deleted successfully',
        });
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
        const { user_id } = req.user;
        const { colabId } = req.params;

        const updatedGroup = await colabObject.leaveGroup(colabId, user_id);
        if (!updatedGroup.admins.length && !updatedGroup.normalMembers.length) {
            await colabObject.deleteGroup(colabId);
            return res.status(OK).json({
                message: 'successfully left the group & group has been deleted',
            });
        }
        return res.status(OK).json({
            message: 'successfully left the group',
        });
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
        const { colabId, userId } = req.params;

        await colabObject.removeSomeoneFromGroup(colabId, userId);

        return res.status(OK).json({
            message: 'user removed from group successfully',
        });
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
        const { colabId, userId } = req.params;

        await colabObject.addSomeoneToGroup(colabId, userId);

        return res.status(OK).json({
            message: 'user added to group successfully',
        });
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
        const { colabId, userId } = req.params;

        await colabObject.promoteToAdmin(colabId, userId);

        return res.status(OK).json({
            message: 'user promoted to admin successfully',
        });
    } catch (err) {
        console.log(err);
        return res.status(SERVER_ERROR).json({
            message: 'Something went wrong while promoting someone to admin',
            error: err.message,
        });
    }
};

export {
    addCollaboration,
    removeCollaboration,
    createGroup,
    deleteGroup,
    leaveGroup,
    removeSomeoneFromGroup,
    addSomeoneToGroup,
    promoteSomeoneToAdmin,
};
