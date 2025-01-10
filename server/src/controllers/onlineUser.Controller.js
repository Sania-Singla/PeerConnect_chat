import getServiceObject from '../db/serviceObjects.js';
import { SERVER_ERROR, OK, BAD_REQUEST } from '../constants/errorCodes.js';

export const onlineUserObject = getServiceObject('onlineUsers');

const getOnlineUser = async (req, res) => {
    try {
        const { userId } = req.params; // check for user exists

        const user = await onlineUserObject.getOnlineUser(userId);
        if (user) {
            return res.status(OK).json(user);
        } else {
            return res.status(OK).json({ message: 'user is offline' });
        }
    } catch (err) {
        console.log(err);
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while getting the online user.',
            error: err.message,
        });
    }
};

const markUserOnline = async (req, res) => {
    try {
        const { userId } = req.params; // check for user exists
        const { socketId } = req.body;

        if (!socketId) {
            return res
                .status(BAD_REQUEST)
                .json({ message: 'socketId is required' });
        }

        const user = await onlineUserObject.markUserOnline(userId, socketId);

        return res.status(OK).json(user);
    } catch (err) {
        console.log(err);
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while getting the messages.',
            error: err.message,
        });
    }
};

const markUserOffline = async (req, res) => {
    try {
        const { userId } = req.params; // check for user exists

        const user = await onlineUserObject.markUserOffline(userId);

        return res.status(OK).json(user);
    } catch (err) {
        console.log(err);
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while getting the chats.',
            error: err.message,
        });
    }
};

export { getOnlineUser, markUserOffline, markUserOnline };
