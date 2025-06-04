import express from 'express';
export const userRouter = express.Router();
import {
    upload,
    verifyJwt,
    optionalVerifyJwt,
    validateUUID,
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
    getAdminStats,
    loginWithGoogle,
} from '../controllers/user.Controller.js';

userRouter.route('/register').post(registerUser);

userRouter
    .route('/channel/:channelId')
    .get(validateUUID('channelId'), optionalVerifyJwt, getChannelProfile);

userRouter.route('/login').post(loginUser);

userRouter.route('/google/login').post(loginWithGoogle);

userRouter.use(verifyJwt);

userRouter.route('/logout').patch(logoutUser);

userRouter.route('/delete').delete(deleteAccount);

userRouter.route('/current').get(getCurrentUser);

userRouter.route('/stats').get(getAdminStats);

userRouter.route('/account').patch(updateAccountDetails);

userRouter.route('/channel').patch(updateChannelDetails);

userRouter.route('/password').patch(updatePassword);

userRouter.route('/avatar').patch(upload.single('avatar'), updateAvatar);

userRouter
    .route('/coverImage')
    .patch(upload.single('coverImage'), updateCoverImage);

userRouter.route('/history').get(getWatchHistory).delete(clearWatchHistory);
