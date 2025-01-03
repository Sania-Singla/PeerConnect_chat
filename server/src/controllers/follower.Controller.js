import { BAD_REQUEST, SERVER_ERROR, OK } from '../constants/errorCodes.js';
import getServiceObject from '../db/serviceObjects.js';

export const followerObject = getServiceObject('followers');

const getFollowers = async (req, res) => {
    try {
        const channelId = req.channel.user_id;
        const result = await followerObject.getFollowers(channelId);
        if (result.length) {
            return res.status(OK).json(result);
        } else {
            return res.status(OK).json({ message: 'no followers found' });
        }
    } catch (err) {
        console.log(err);
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while fetching the total followers',
            error: err.message,
        });
    }
};

const getFollowings = async (req, res) => {
    try {
        const channelId = req.channel.user_id;
        const result = await followerObject.getFollowings(channelId);
        if (result.length) {
            return res.status(OK).json(result);
        } else {
            return res.status(OK).json({ message: 'no channels followed' });
        }
    } catch (err) {
        console.log(err);
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while fetching the total followings',
            error: err.message,
        });
    }
};

const toggleFollow = async (req, res) => {
    try {
        const channelId = req.channel.user_id; // channel to follow/unfollow
        const { user_id } = req.user;

        if (user_id === channelId) {
            return res
                .status(BAD_REQUEST)
                .json({ message: "can't follow own channel" });
        }

        await followerObject.toggleFollow(channelId, user_id);
        
        return res.status(OK).json({ message: 'follow toggled successfully' });
    } catch (err) {
        console.log(err);
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while toggling follow',
            error: err.message,
        });
    }
};

export { getFollowers, getFollowings, toggleFollow };
