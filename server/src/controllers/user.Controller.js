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
    verifyExpression,
    verifyOrderBy,
} from '../utils/index.js';

export const userObject = getServiceObject('users');

const registerUser = async (req, res) => {
    let coverImageURL, avatarURL;
    try {
        const { userName, email, firstName, lastName, password } = req.body;
        const data = {
            userId: uuid(),
            userName,
            firstName,
            lastName,
            email,
            password,
            avatar: req.files?.avatar?.[0].path,
            coverImage: req.files?.coverImage?.[0].path,
        };

        // field validity/empty checks
        const allowedEmptyFields = ['lastName', 'coverImage'];

        for (const [key, value] of Object.entries(data)) {
            if (!value && !allowedEmptyFields.includes(key)) {
                // Remove uploaded files if any
                if (data.avatar) {
                    fs.unlinkSync(data.avatar);
                }
                if (data.coverImage) {
                    fs.unlinkSync(data.coverImage);
                }

                return res
                    .status(BAD_REQUEST)
                    .json({ message: 'missing fields' });
            }

            if (value && key !== 'userId') {
                const isValid =
                    key === 'avatar' || key === 'coverImage'
                        ? verifyExpression('file', value)
                        : verifyExpression(key, value);

                if (!isValid) {
                    // Remove uploaded files if any
                    if (data.avatar) {
                        fs.unlinkSync(data.avatar);
                    }
                    if (data.coverImage) {
                        fs.unlinkSync(data.coverImage);
                    }

                    return res.status(BAD_REQUEST).json({
                        message:
                            key === 'avatar' || key === 'coverImage'
                                ? `only png, jpg/jpeg files are allowed for ${key} and File size should not exceed 100MB.`
                                : `${key} is invalid`,
                    });
                }
            }
        }

        const existingUser = await userObject.getUser({
            email: data.email,
            userName: data.userName,
        });

        if (existingUser) {
            // Remove uploaded files if any
            if (data.avatar) {
                fs.unlinkSync(data.avatar);
            }
            if (data.coverImage) {
                fs.unlinkSync(data.coverImage);
            }

            return res
                .status(BAD_REQUEST)
                .json({ message: 'user already exists' });
        }

        let result = await uploadOnCloudinary(data.avatar);
        data.avatar = result.secure_url;
        avatarURL = data.avatar;

        if (data.coverImage) {
            result = await uploadOnCloudinary(data.coverImage);
            data.coverImage = result.secure_url;
            coverImageURL = data.coverImage;
        }

        data.password = await bcrypt.hash(data.password, 10); // hash the password

        const user = await userObject.createUser(data);

        return res.status(OK).json(user);
    } catch (err) {
        if (avatarURL) {
            await deleteFromCloudinary(avatarURL);
        }
        if (coverImageURL) {
            await deleteFromCloudinary(coverImageURL);
        }
        console.log(err);
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
        if (!user) {
            return res.status(NOT_FOUND).json({ message: 'user not found' });
        }

        const isPassValid = bcrypt.compareSync(password, user.user_password);
        if (!isPassValid) {
            return res
                .status(BAD_REQUEST)
                .json({ message: 'invalid credentials' });
        }

        const { accessToken, refreshToken } = await generateTokens(user);

        await userObject.loginUser(user.user_id, refreshToken);

        const { user_password, refresh_token, ...loggedInUser } = user; // for mongo

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
        console.log(err);
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while logging the user.',
            error: err.message,
        });
    }
};

const deleteAccount = async (req, res) => {
    try {
        const { user_id, user_password, user_coverImage, user_avatar } =
            req.user;
        const { password } = req.body;

        const isPassValid = bcrypt.compareSync(password, user_password);
        if (!isPassValid) {
            return res
                .status(BAD_REQUEST)
                .json({ message: 'invalid credentials' });
        }

        await userObject.deleteUser(user_id);

        await deleteFromCloudinary(user_coverImage);
        await deleteFromCloudinary(user_avatar);

        return res
            .status(OK)
            .clearCookie('peerConnect_accessToken', COOKIE_OPTIONS)
            .clearCookie('peerConnect_refreshToken', COOKIE_OPTIONS)
            .json({ message: 'account deleted successfully' });
    } catch (err) {
        console.log(err);
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while deleting the user account.',
            error: err.message,
        });
    }
};

const logoutUser = async (req, res) => {
    try {
        await userObject.logoutUser(req.user?.user_id);
        return res
            .status(OK)
            .clearCookie('peerConnect_accessToken', COOKIE_OPTIONS)
            .clearCookie('peerConnect_refreshToken', COOKIE_OPTIONS)
            .json({ message: 'user loggedout successfully' });
    } catch (err) {
        console.log(err);
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
        console.log(err);
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while getting the current user.',
            error: err.message,
        });
    }
};

const getChannelProfile = async (req, res) => {
    try {
        const channelId = req.channel.user_id;
        const userId = req.user?.user_id;

        const channelProfile = await userObject.getChannelProfile(
            channelId,
            userId
        );
        return res.status(OK).json(channelProfile);
    } catch (err) {
        console.log(err);
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
            userId: user_id,
            firstName,
            lastName,
            email,
        });

        return res.status(OK).json(updatedUser);
    } catch (err) {
        console.log(err);
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
            userId: user_id,
            userName,
            bio,
        });

        return res.status(OK).json(updatedUser);
    } catch (err) {
        console.log(err);
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

        await userObject.updatePassword(user_id, hashedNewPassword);

        return res
            .status(OK)
            .json({ message: 'password updated successfully' });
    } catch (err) {
        console.log(err);
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

        const result = await uploadOnCloudinary(req.file.path);
        avatar = result.secure_url;

        const updatedUser = await userObject.updateAvatar(user_id, avatar);

        if (updatedUser) {
            await deleteFromCloudinary(user_avatar);
        }

        return res.status(OK).json(updatedUser);
    } catch (err) {
        if (avatar) {
            await deleteFromCloudinary(avatar);
        }
        console.log(err);
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

        const result = await uploadOnCloudinary(req.file.path);
        coverImage = result.secure_url;

        const updatedUser = await userObject.updateCoverImage(
            user_id,
            coverImage
        );

        if (updatedUser && user_coverImage) {
            await deleteFromCloudinary(user_coverImage);
        }

        return res.status(OK).json(updatedUser);
    } catch (err) {
        if (coverImage) {
            await deleteFromCloudinary(coverImage);
        }
        console.log(err);
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

        if (!verifyOrderBy(orderBy)) {
            return res
                .status(BAD_REQUEST)
                .json({ message: 'invalid orderBy value' });
        }

        const result = await userObject.getWatchHistory(
            user_id,
            orderBy.toUpperCase(),
            Number(limit),
            Number(page)
        );

        if (result.docs.length) {
            const data = {
                posts: result.docs,
                postaInfo: {
                    hasNextPage: result.hasNextPage,
                    hasPrevPage: result.hasPrevPage,
                    totalPosts: result.totalDocs,
                },
            };
            return res.status(OK).json(data);
        } else {
            return res.status(OK).json({ message: 'empty watch history' });
        }
    } catch (err) {
        console.log(err);
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while getting the watch history',
            error: err.message,
        });
    }
};

const clearWatchHistory = async (req, res) => {
    try {
        const { user_id } = req.user;
        await userObject.clearWatchHistory(user_id);
        return res
            .status(OK)
            .json({ message: 'watch history cleared successfully' });
    } catch (err) {
        console.log(err);
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
