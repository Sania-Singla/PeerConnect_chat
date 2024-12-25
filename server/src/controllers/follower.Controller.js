import validator from 'validator';
import { BAD_REQUEST, SERVER_ERROR, OK } from '../constants/errorCodes.js';
import getServiceObject from '../db/serviceObjects.js';
import { userObject } from './user.Controller.js';

export const followerObject = getServiceObject('followers');

const getFollowers = async (req, res) => {
    try {
        const { channelId } = req.params;
        if (!channelId || !validator.isUUID(channelId)) {
            return res.status(BAD_REQUEST).json({
                message: 'missing or invalid channelId',
            });
        }

        const channel = await userObject.getUser(channelId);
        if (channel?.message) {
            return res
                .status(BAD_REQUEST)
                .json({ message: 'channel not found' });
        }

        const response = await followerObject.getFollowers(channelId);
        return res.status(OK).json(response);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while fetching the total followers',
            error: err.message,
        });
    }
};

const getFollowings = async (req, res) => {
    try {
        const { channelId } = req.params;
        if (!channelId || !validator.isUUID(channelId)) {
            return res.status(BAD_REQUEST).json({
                message: 'missing or invalid channelId',
            });
        }

        const channel = await userObject.getUser(channelId);
        if (channel?.message) {
            return res
                .status(BAD_REQUEST)
                .json({ message: 'channel not found' });
        }

        const response = await followerObject.getFollowings(channelId);
        return res.status(OK).json(response);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while fetching the total followings',
            error: err.message,
        });
    }
};

const toggleFollow = async (req, res) => {
    try {
        const { channelId } = req.params;
        const { user_id } = req.user;

        if (!channelId || !validator.isUUID(channelId)) {
            return res.status(BAD_REQUEST).json({
                message: 'missing or invalid channelId',
            });
        }

        if (user_id === channelId) {
            return res.status(BAD_REQUEST).json({ message: 'own channel' });
        }

        const channel = await userObject.getUser(channelId);
        if (channel?.message) {
            return res
                .status(BAD_REQUEST)
                .json({ message: 'channel not found' });
        }

        const response = await followerObject.toggleFollow(user_id, channelId);
        return res.status(OK).json(response);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while toggling follow',
            error: err.message,
        });
    }
};

export { getFollowers, getFollowings, toggleFollow };
