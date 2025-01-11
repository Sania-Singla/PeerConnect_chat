import { BAD_REQUEST, OK } from '../constants/errorCodes.js';
import { getServiceObject } from '../db/serviceObjects.js';
import { ErrorHandler, tryCatch } from '../utils/index.js';

export const followerObject = getServiceObject('followers');

const getFollowers = tryCatch('get followers', async (req, res) => {
    const channelId = req.channel.user_id;
    const result = await followerObject.getFollowers(channelId);
    if (result.length) {
        return res.status(OK).json(result);
    } else {
        return res.status(OK).json({ message: 'no followers found' });
    }
});

const getFollowings = tryCatch('get followings', async (req, res) => {
    const channelId = req.channel.user_id;
    const result = await followerObject.getFollowings(channelId);
    if (result.length) {
        return res.status(OK).json(result);
    } else {
        return res.status(OK).json({ message: 'no channels followed' });
    }
});

const toggleFollow = tryCatch('toggle follow', async (req, res, next) => {
    const channelId = req.channel.user_id;
    const { user_id } = req.user;

    if (user_id === channelId) {
        return next(new ErrorHandler("can't follow own channel", BAD_REQUEST));
    }

    await followerObject.toggleFollow(channelId, user_id);
    return res.status(OK).json({ message: 'follow toggled successfully' });
});

export { getFollowers, getFollowings, toggleFollow };
