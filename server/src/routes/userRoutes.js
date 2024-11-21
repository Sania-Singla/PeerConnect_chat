import express from 'express';
export const userRouter = express.Router();
import { upload, verifyJwt, optionalVerifyJwt } from '../middlewares/index.js';

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
} from '../controllers/userController.js';

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

userRouter.route('/channel/:input').get(optionalVerifyJwt, getChannelProfile); // because getUser is adaptable for username, email & uuid

userRouter.route('/login').post(loginUser);

userRouter.use(verifyJwt);

userRouter.route('/logout').patch(logoutUser);

userRouter.route('/delete').delete(deleteAccount);

userRouter.route('/current').get(getCurrentUser);

userRouter.route('/update-account').patch(updateAccountDetails);

userRouter.route('/update-channel').patch(updateChannelDetails);

userRouter.route('/update-password').patch(updatePassword);

userRouter.route('/history').get(getWatchHistory).delete(clearWatchHistory);

userRouter.route('/update-avatar').patch(upload.single('avatar'), updateAvatar);

userRouter
    .route('/update-coverImage')
    .patch(upload.single('coverImage'), updateCoverImage);
