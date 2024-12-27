import getServiceObject from '../db/serviceObjects.js';
import {
    OK,
    SERVER_ERROR,
    BAD_REQUEST,
    COOKIE_OPTIONS,
    NOT_FOUND,
} from '../constants/errorCodes.js';
import { v4 as uuid } from 'uuid';
import fs from 'fs';
import bcrypt from 'bcrypt';
import {
    uploadOnCloudinary,
    deleteFromCloudinary,
    generateTokens,
} from '../utils/index.js';

export const userObject = getServiceObject('users');

const registerUser = async (req, res) => {
    let coverImage, avatar;
    try {
        const {
            userName,
            firstName,
            lastName = '',
            email,
            password,
        } = req.body;

        const userId = uuid();

        if (!userName || !firstName || !email || !password) {
            return res.status(BAD_REQUEST).json({ message: 'missing fields' });
        }

        // ⭐ format validity checks for email , username, firstname, if have lastname (frontend)

        const existingUser = await userObject.getUser(userName);

        if (!existingUser?.message) {
            if (req.files?.avatar) {
                fs.unlinkSync(req.files.avatar[0].path);
            }
            if (req.files?.coverImage) {
                fs.unlinkSync(req.files.coverImage[0].path);
            }
            return res
                .status(BAD_REQUEST)
                .json({ message: 'user already exists' });
        }

        if (!req.files?.avatar) {
            if (req.files?.coverImage) {
                const coverImageLocalPath = req.files.coverImage[0].path;
                if (!coverImageLocalPath) {
                    throw new Error('coverImage local path multer issue');
                }
                fs.unlinkSync(coverImageLocalPath);
            }
            return res.status(BAD_REQUEST).json({ message: 'missing avatar' });
        }

        const avatarLocalPath = req.files.avatar[0].path;
        if (!avatarLocalPath) {
            throw new Error('avatar local path multer issue');
        }
        avatar = await uploadOnCloudinary(avatarLocalPath);

        if (req.files?.coverImage) {
            const coverImageLocalPath = req.files.coverImage[0].path;
            if (!coverImageLocalPath) {
                throw new Error('coverImage local path multer issue');
            }
            coverImage = await uploadOnCloudinary(coverImageLocalPath);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userObject.createUser({
            userId,
            userName,
            firstName,
            lastName,
            avatarURL: avatar?.url,
            coverImageURL: coverImage?.url,
            email,
            hashedPassword,
        });

        return res.status(OK).json(user);
    } catch (err) {
        if (avatar) {
            await deleteFromCloudinary(avatar.url);
        }
        if (coverImage) {
            await deleteFromCloudinary(coverImage.url);
        }
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while registering the user.',
            error: err.message,
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { loginInput, password } = req.body;

        if (!loginInput || !password) {
            return res.status(BAD_REQUEST).json({ message: 'missing fields' });
        }

        const user = await userObject.getUser(loginInput);
        if (user?.message) {
            return res.status(NOT_FOUND).json({ message: 'user not found' });
        }

        const isPassValid = bcrypt.compareSync(password, user.user_password);
        if (!isPassValid) {
            return res
                .status(BAD_REQUEST)
                .json({ message: 'invalid credentials' });
        }

        const { accessToken, refreshToken } = await generateTokens(user);

        const { user_password, refresh_token, ...loggedInUser } = user;

        return res
            .status(OK)
            .cookie('peerConnect_accessToken', accessToken, {
                ...COOKIE_OPTIONS,
                maxAge: parseInt(process.env.ACCESS_TOKEN_MAXAGE),
            })
            .cookie('peerConnect_refreshToken', refreshToken, {
                ...COOKIE_OPTIONS,
                maxAge: parseInt(process.env.REFRESH_TOKEN_MAXAGE),
            })
            .json(loggedInUser);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while logging the user.',
            error: err.message,
        });
    }
};

const deleteAccount = async (req, res) => {
    try {
        const user = req.user;
        const { password } = req.body;

        const isPassValid = bcrypt.compareSync(password, user.user_password);
        if (!isPassValid) {
            return res
                .status(BAD_REQUEST)
                .json({ message: 'invalid credentials' });
        }

        await deleteFromCloudinary(user.user_coverImage);
        await deleteFromCloudinary(user.user_avatar);

        await userObject.deleteUser(user.user_id);

        return res
            .status(OK)
            .clearCookie('peerConnect_accessToken', COOKIE_OPTIONS)
            .clearCookie('peerConnect_refreshToken', COOKIE_OPTIONS)
            .json({ message: 'account deleted' });
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while deleting the user account.',
            error: err.message,
        });
    }
};

const logoutUser = async (req, res) => {
    try {
        const { user_id } = req.user;

        await userObject.logoutUser(user_id);

        return res
            .status(OK)
            .clearCookie('peerConnect_accessToken', COOKIE_OPTIONS)
            .clearCookie('peerConnect_accessToken', COOKIE_OPTIONS)
            .json({ message: 'user logged out' });
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while logging the user out.',
            error: err.message,
        });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const { user_password, refresh_token, ...user } = req.user;
        return res.status(OK).json(user);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while getting the current user.',
            error: err.message,
        });
    }
};

const getChannelProfile = async (req, res) => {
    try {
        const { input } = req.params;
        const user = req.user;

        const channel = await userObject.getUser(input);
        if (channel?.message) {
            return res
                .status(BAD_REQUEST)
                .json({ message: 'channel not found' });
        }

        const channelProfile = await userObject.getChannelProfile(
            channel?.user_id,
            user?.user_id
        );
        return res.status(OK).json(channelProfile);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while getting the channel profile.',
            error: err.message,
        });
    }
};

const updateAccountDetails = async (req, res) => {
    try {
        const { user_id, user_password } = req.user;
        const { firstName, lastName, email, password } = req.body;

        const isPassValid = bcrypt.compareSync(password, user_password);
        if (!isPassValid) {
            return res
                .status(BAD_REQUEST)
                .json({ message: 'invalid credentials' });
        }

        const updatedUser = await userObject.updateAccountDetails({
            user_id,
            firstName,
            lastName,
            email,
        });

        return res.status(OK).json(updatedUser);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while updating account details.',
            error: err.message,
        });
    }
};

const updateChannelDetails = async (req, res) => {
    try {
        const { user_id, user_password } = req.user;
        const { userName, bio, password } = req.body;

        const isPassValid = bcrypt.compareSync(password, user_password);
        if (!isPassValid) {
            return res
                .status(BAD_REQUEST)
                .json({ message: 'invalid credentials' });
        }

        const updatedUser = await userObject.updateChannelDetails({
            user_id,
            userName,
            bio,
        });

        return res.status(OK).json(updatedUser);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while updating channel details.',
            error: err.message,
        });
    }
};

const updatePassword = async (req, res) => {
    try {
        const { user_id, user_password } = req.user;
        const { oldPassword, newPassword } = req.body;

        const isPassValid = bcrypt.compareSync(oldPassword, user_password);
        if (!isPassValid) {
            return res
                .status(BAD_REQUEST)
                .json({ message: 'invalid credentials' });
        }

        const hashedNewPassword = bcrypt.hashSync(newPassword, 10);

        const updatedUser = await userObject.updatePassword(
            user_id,
            hashedNewPassword
        );

        return res.status(OK).json(updatedUser);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while updating password.',
            error: err.message,
        });
    }
};

const updateAvatar = async (req, res) => {
    let avatar;
    try {
        const { user_id, user_avatar } = req.user;

        if (!req.file) {
            return res.status(BAD_REQUEST).json({ message: 'missing avatar' });
        }

        const avatarLocalPath = req.file?.path;

        if (!avatarLocalPath) {
            throw new Error('avatar local path multer issue');
        }

        avatar = await uploadOnCloudinary(avatarLocalPath);

        const updatedUser = await userObject.updateAvatar(user_id, avatar?.url);

        if (updatedUser) {
            await deleteFromCloudinary(user_avatar);
        }

        return res.status(OK).json(updatedUser);
    } catch (err) {
        if (avatar) {
            await deleteFromCloudinary(avatar.url);
        }
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while updating avatar.',
            error: err.message,
        });
    }
};

const updateCoverImage = async (req, res) => {
    let coverImage;
    try {
        const { user_id, user_coverImage } = req.user;

        if (!req.file) {
            return res
                .status(BAD_REQUEST)
                .json({ message: 'missing coverImage' });
        }

        const coverImageLocalPath = req.file?.path;

        if (!coverImageLocalPath) {
            throw new Error('coverImage local path multer issue');
        }

        coverImage = await uploadOnCloudinary(coverImageLocalPath);

        const updatedUser = await userObject.updateCoverImage(
            user_id,
            coverImage?.url
        );

        if (updatedUser && user_coverImage) {
            await deleteFromCloudinary(user_coverImage);
        }

        return res.status(OK).json(updatedUser);
    } catch (err) {
        if (coverImage) {
            await deleteFromCloudinary(coverImage.url);
        }
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while updating coverImage.',
            error: err.message,
        });
    }
};

const getWatchHistory = async (req, res) => {
    try {
        const { orderBy = 'desc', limit = 10, page = 1 } = req.query;
        const { user_id } = req.user;

        const response = await userObject.getWatchHistory(
            user_id,
            orderBy.toUpperCase(),
            Number(limit),
            Number(page)
        );

        return res.status(OK).json(response);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while getting the watch history',
            error: err.message,
        });
    }
};

const clearWatchHistory = async (req, res) => {
    try {
        const { user_id } = req.user;
        const response = await userObject.clearWatchHistory(user_id);
        return res.status(OK).json(response);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while clearing the watch history',
            error: err.message,
        });
    }
};

export {
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
};
