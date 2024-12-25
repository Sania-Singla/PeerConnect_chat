import express from 'express';
export const followerRouter = express.Router();
import { verifyJwt } from '../middlewares/auth.Middleware.js';

import {
    getFollowers,
    getFollowings,
    toggleFollow,
} from '../controllers/follower.Controller.js';

followerRouter.route('/follows/:channelId').get(getFollowings);

followerRouter.route('/toggle/:channelId').post(verifyJwt, toggleFollow);

followerRouter.route('/:channelId').get(getFollowers);
