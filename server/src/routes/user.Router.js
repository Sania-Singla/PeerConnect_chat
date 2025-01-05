import express from 'express';
export const userRouter = express.Router();
import {
    upload,
    verifyJwt,
    optionalVerifyJwt,
    doesResourceExist,
} from '../middlewares/index.js';

import {
    registerUser,
    loginUser,
    logoutUser,
    deleteAccount,
    updateAccountDetails,
    updateAvatar,
    updateChannelDetails,
    updatePassword,
    updateCoverImage,
    getChannelProfile,
    getCurrentUser,
    getWatchHistory,
    clearWatchHistory,
} from '../controllers/user.Controller.js';

const doesChannelExist = doesResourceExist('user', 'channelId', 'channel');

userRouter.route('/register').post(
    upload.fields([
        {
            name: 'avatar',
            maxCount: 1,
        },
        {
            name: 'coverImage',
            maxCount: 1,
        },
    ]),
    registerUser
);

userRouter
    .route('/channel/:channelId')
    .get(doesChannelExist, optionalVerifyJwt, getChannelProfile);

userRouter.route('/login').post(loginUser);

userRouter.use(verifyJwt);

userRouter.route('/logout').patch(logoutUser);

userRouter.route('/delete').delete(deleteAccount);

userRouter.route('/current').get(getCurrentUser);

userRouter.route('/account').patch(updateAccountDetails);

userRouter.route('/channel').patch(updateChannelDetails);

userRouter.route('/password').patch(updatePassword);

userRouter.route('/avatar').patch(upload.single('avatar'), updateAvatar);

userRouter
    .route('/coverImage')
    .patch(upload.single('coverImage'), updateCoverImage);

userRouter.route('/history').get(getWatchHistory).delete(clearWatchHistory);
