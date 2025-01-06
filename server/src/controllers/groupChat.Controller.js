import getServiceObject from '../db/serviceObjects.js';
import { SERVER_ERROR, OK, BAD_REQUEST } from '../constants/errorCodes.js';

const groupChatObject = getServiceObject('groupChats');

const addCollaboration = async (req, res) => {
    try {
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
