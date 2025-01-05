import express from 'express';
export const followerRouter = express.Router();
import { doesResourceExist, verifyJwt } from '../middlewares/index.js';

import {
    getFollowers,
    getFollowings,
    toggleFollow,
} from '../controllers/follower.Controller.js';

const doesChannelExist = doesResourceExist('user', 'channelId', 'channel');

// followerRouter.use(doesChannelExist);  // causes error because the params might have not been set yet (waterfall effect)

followerRouter
    .route('/follows/:channelId')
    .get(doesChannelExist, getFollowings);

followerRouter
    .route('/toggle/:channelId')
    .post(doesChannelExist, verifyJwt, toggleFollow);

followerRouter.route('/:channelId').get(doesChannelExist, getFollowers);
