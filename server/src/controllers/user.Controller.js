import { getServiceObject } from '../db/serviceObjects.js';
import { OK, BAD_REQUEST, NOT_FOUND } from '../constants/errorCodes.js';
import { COOKIE_OPTIONS } from '../constants/options.js';
import fs from 'fs';
import bcrypt from 'bcrypt';
import {
    verifyExpression,
    verifyOrderBy,
    tryCatch,
    ErrorHandler,
} from '../utils/index.js';
import {
    uploadOnCloudinary,
    deleteFromCloudinary,
    generateTokens,
} from '../helpers/index.js';

export const userObject = getServiceObject('users');

const registerUser = tryCatch('register user', async (req, res, next) => {
    let coverImageURL, avatarURL;
    try {
        const { userName, email, firstName, lastName, password } = req.body;
        const data = {
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
            if (value) {
                const isValid = verifyExpression(
                    key === 'avatar' || key === 'coverImage' ? 'file' : key,
                    value
                );

                if (!isValid) {
                    // Remove uploaded files if any
                    if (data.avatar) fs.unlinkSync(data.avatar);
                    if (data.coverImage) fs.unlinkSync(data.coverImage);

                    return next(
                        new ErrorHandler(
                            key === 'avatar' || key === 'coverImage'
                                ? `only png, jpg/jpeg files are allowed for ${key} and File size should not exceed 100MB.`
                                : `${key} is invalid`,
                            BAD_REQUEST
                        )
                    );
                }
            } else if (!allowedEmptyFields.includes(key)) {
                if (data.avatar) fs.unlinkSync(data.avatar);
                if (data.coverImage) fs.unlinkSync(data.coverImage);
                return next(new ErrorHandler('missing fields', BAD_REQUEST));
            }
        }

        let existingUser = await userObject.getUser(data.email);
        if (!existingUser) {
            existingUser = await userObject.getUser(data.userName);
        }

        if (existingUser) {
            if (data.avatar) fs.unlinkSync(data.avatar);
            if (data.coverImage) fs.unlinkSync(data.coverImage);
            return next(new ErrorHandler('user already exists', BAD_REQUEST));
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
        if (avatarURL) await deleteFromCloudinary(avatarURL);
        if (coverImageURL) await deleteFromCloudinary(coverImageURL);

        throw err;
    }
});

const loginUser = tryCatch('login user', async (req, res, next) => {
    const { loginInput, password } = req.body;

    if (!loginInput || !password) {
        return next(new ErrorHandler('missing fields', BAD_REQUEST));
    }

    const user = await userObject.getUser(loginInput);
    if (!user) {
        return next(new ErrorHandler('user not found', BAD_REQUEST));
    }

    const isPassValid = bcrypt.compareSync(password, user.user_password);
    if (!isPassValid) {
        return next(new ErrorHandler('invalid credentials', BAD_REQUEST));
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
});

const deleteAccount = tryCatch(
    'delete user account',
    async (req, res, next) => {
        const { user_id, user_password, user_coverImage, user_avatar } =
            req.user;
        const { password } = req.body;

        const isPassValid = bcrypt.compareSync(password, user_password);
        if (!isPassValid) {
            return next(new ErrorHandler('invalid credentials', BAD_REQUEST));
        }

        await userObject.deleteUser(user_id);

        await deleteFromCloudinary(user_coverImage);
        await deleteFromCloudinary(user_avatar);

        return res
            .status(OK)
            .clearCookie('peerConnect_accessToken', COOKIE_OPTIONS)
            .clearCookie('peerConnect_refreshToken', COOKIE_OPTIONS)
            .json({ message: 'account deleted successfully' });
    }
);

const logoutUser = tryCatch('logout user', async (req, res) => {
    await userObject.logoutUser(req.user?.user_id);
    return res
        .status(OK)
        .clearCookie('peerConnect_accessToken', COOKIE_OPTIONS)
        .clearCookie('peerConnect_refreshToken', COOKIE_OPTIONS)
        .json({ message: 'user loggedout successfully' });
});

const getCurrentUser = tryCatch('get Current user', (req, res) => {
    const { user_password, refresh_token, ...user } = req.user;
    return res.status(OK).json(user);
});

const getChannelProfile = tryCatch(
    'get channel profile',
    async (req, res, next) => {
        const { channelId } = req.params;
        const userId = req.user?.user_id;
        const result = await userObject.getChannelProfile(channelId, userId);
        if (!result) {
            return next(new ErrorHandler('channel not found', NOT_FOUND));
        }
        return res.status(OK).json(result);
    }
);

const updateAccountDetails = tryCatch(
    'update account details',
    async (req, res, next) => {
        const { user_id, user_password } = req.user;
        const { firstName, lastName, email, password } = req.body;

        const isPassValid = bcrypt.compareSync(password, user_password);
        if (!isPassValid) {
            return next(new ErrorHandler('invalid credentials', BAD_REQUEST));
        }

        const updatedUser = await userObject.updateAccountDetails({
            userId: user_id,
            firstName,
            lastName,
            email,
        });

        return res.status(OK).json(updatedUser);
    }
);

const updateChannelDetails = tryCatch(
    'update channel details',
    async (req, res, next) => {
        const { user_id, user_password } = req.user;
        const { userName, bio, password } = req.body;

        const isPassValid = bcrypt.compareSync(password, user_password);
        if (!isPassValid) {
            return next(new ErrorHandler('invalid credentials', BAD_REQUEST));
        }

        const updatedUser = await userObject.updateChannelDetails({
            userId: user_id,
            userName,
            bio,
        });

        return res.status(OK).json(updatedUser);
    }
);

const updatePassword = tryCatch('update password', async (req, res, next) => {
    const { user_id, user_password } = req.user;
    const { oldPassword, newPassword } = req.body;

    const isPassValid = bcrypt.compareSync(oldPassword, user_password);
    if (!isPassValid) {
        return next(new ErrorHandler('invalid credentials', BAD_REQUEST));
    }

    const hashedNewPassword = bcrypt.hashSync(newPassword, 10);

    await userObject.updatePassword(user_id, hashedNewPassword);

    return res.status(OK).json({ message: 'password updated successfully' });
});

const updateAvatar = tryCatch('update avatar', async (req, res, next) => {
    let avatar;
    try {
        const { user_id, user_avatar } = req.user;

        if (!req.file) {
            return next(new ErrorHandler('missing avatar', BAD_REQUEST));
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
        throw err;
    }
});

const updateCoverImage = tryCatch(
    'update coverImage',
    async (req, res, next) => {
        let coverImage;
        try {
            const { user_id, user_coverImage } = req.user;

            if (!req.file) {
                return next(
                    new ErrorHandler('missing coverImage', BAD_REQUEST)
                );
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
            throw err;
        }
    }
);

const getWatchHistory = tryCatch(
    'get watch history',
    async (req, res, next) => {
        const { orderBy = 'desc', limit = 10, page = 1 } = req.query;
        const { user_id } = req.user;

        if (!verifyOrderBy(orderBy)) {
            return next(new ErrorHandler('invalid orderBy value', BAD_REQUEST));
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
    }
);

const clearWatchHistory = tryCatch('clear watch history', async (req, res) => {
    await userObject.clearWatchHistory(req.user?.user_id);
    return res
        .status(OK)
        .json({ message: 'watch history cleared successfully' });
});

const getAdminStats = tryCatch('get admin stats', async (req, res, next) => {
    const { user_id } = req.user;
    const result = await userObject.getAdminStats(user_id);
    return res.status(OK).json(result);
});

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
    getAdminStats,
};
