import getServiceObject from "../db/serviceObjects.js";
import { OK, SERVER_ERROR, BAD_REQUEST, COOKIE_OPTIONS } from "../constants/errorCodes.js";
import { v4 as uuid } from "uuid";
import fs from "fs";
import bcrypt from "bcrypt";
import { uploadOnCloudinary, deleteFromCloudinary, generateAccessToken, generateRefreshToken, verifyPassword } from "../utils/index.js";

export const userObject = getServiceObject("users");

// pending form validity
const registerUser = async (req, res) => {
    try {
        const { userName, firstName, lastName, email, password } = req.body;
        const userId = uuid();

        if (!userId) {
            throw new Error({ message: "USERID_CREATION_UUID_ISSUE" });
        }

        if (!userName || !firstName || !email || !password) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_FIELDS" });
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
            return res.status(BAD_REQUEST).json({ message: "USER_ALREADY_EXISTS" });
        }

        if (!req.files?.avatar) {
            if (req.files?.coverImage) {
                const coverImageLocalPath = req.files.coverImage[0].path;
                if (!coverImageLocalPath) {
                    throw new Error({ message: "COVERIMAGE_LOCALPATH_MULTER_ISSUE" });
                }
                fs.unlinkSync(coverImageLocalPath);
            }
            return res.status(BAD_REQUEST).json({ message: "MISSING_AVATAR" });
        }

        const avatarLocalPath = req.files.avatar[0].path;
        if (!avatarLocalPath) {
            throw new Error({ message: "AVATAR_LOCALPATH_MULTER_ISSUE" });
        }
        const avatar = await uploadOnCloudinary(avatarLocalPath);
        if (!avatar) {
            return res.status(500).json({ message: "AVATAR_UPLOAD_CLOUDINARY_ISSUE" });
        }

        let coverImage;
        if (req.files?.coverImage) {
            const coverImageLocalPath = req.files.coverImage[0].path;
            if (!coverImageLocalPath) {
                throw new Error({ message: "COVERIMAGE_LOCALPATH_MULTER_ISSUE" });
            }
            coverImage = await uploadOnCloudinary(coverImageLocalPath);
            if (!coverImage) {
                return res.status(500).json({ message: "COVERIMAGE_UPLOAD_CLOUDINARY_ISSUE" });
            }
        }

        const avatarURL = avatar.url;
        const coverImageURL = coverImage.url;

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userObject.createUser(userId, userName, firstName, lastName, avatarURL, coverImageURL, email, hashedPassword);

        return res.status(OK).json(user);
    } catch (err) {
        return res.status(SERVER_ERROR).json({ message: "something went wrong while registering the user.", error: err.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { loginInput, password } = req.body;

        if (!loginInput || !password) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_FIELDS" });
        }

        const user = await userObject.getUser(loginInput);
        if (user?.message) {
            return res.status(BAD_REQUEST).json(user); // user = {message:"USER_NOT_FOUND"}
        }

        const response = await verifyPassword(password, user.user_password);
        if (response?.message) {
            return res.status(BAD_REQUEST).json(response);
        }

        const accessToken = await generateAccessToken(user.user_id);
        const refreshToken = await generateRefreshToken(user.user_id);

        const { user_password, refresh_token, ...loggedUser } = user;

        return res
            .status(OK)
            .cookie("accessToken", accessToken, {
                ...COOKIE_OPTIONS,
                maxAge: parseInt(process.env.ACCESS_TOKEN_MAXAGE), // cause .env saves everything in strings (so store the final value in .env as 60000 not as 60*1000)
            })
            .cookie("refreshToken", refreshToken, {
                ...COOKIE_OPTIONS,
                maxAge: parseInt(process.env.REFRESH_TOKEN_MAXAGE),
            })
            .json(loggedUser);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while logging the user.",
            error: err.message,
        });
    }
};

const deleteAccount = async (req, res) => {
    try {
        const user = req.user;
        const { password } = req.body;

        if (!user) {
            return res.status(BAD_REQUEST).json({ message: "CURRENT_USER_MISSING" });
        }

        // ⭐ alreaady done in verifyJWT
        // const user = await userObject.getUser(user.user_id);
        // if (user?.message) {
        //     return res.status(BAD_REQUEST).json(user);
        // }

        const response = await verifyPassword(password, user.user_password);
        if (response?.message) {
            return res.status(BAD_REQUEST).json(response);
        }

        // delete its avatar & coverimage from cloudinary
        const response1 = await deleteFromCloudinary(user.user_coverImage);
        if (response1.result !== "ok") {
            throw new Error({ message: "COVERIMAGE_DELETION_CLOUDINARY_ISSUE" });
        }

        const response2 = await deleteFromCloudinary(user.user_avatar);
        if (response2.result !== "ok") {
            throw new Error({ message: "AVATAR_DELETION_CLOUDINARY_ISSUE" });
        }

        await userObject.deleteUser(user.user_id);
        return res
            .status(OK)
            .clearCookie("accessToken", COOKIE_OPTIONS)
            .clearCookie("refreshToken", COOKIE_OPTIONS)
            .json({ message: "DELETION_SUCCESSFULL" });
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while delete the user account.",
            error: err.message,
        });
    }
};

const logoutUser = async (req, res) => {
    try {
        const { user_id } = req.user;

        if (!user_id) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_USERID" });
        }

        // ⭐ alreaady done in verifyJWT
        // const user = await userObject.getUser(user_id);
        // if (user?.message) {
        //     return res.status(BAD_REQUEST).json(user);
        // }

        await userObject.logoutUser(user_id);
        return res
            .status(OK)
            .clearCookie("accessToken", COOKIE_OPTIONS)
            .clearCookie("refreshToken", COOKIE_OPTIONS)
            .json({ message: "LOGGED_OUT_SUCCESSFULLY" });
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while logging the user out.",
            error: err.message,
        });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const user = req.user;
        return res.status(OK).json(user);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while getting the current user.",
            error: err.message,
        });
    }
};

const getChannelProfile = async (req, res) => {
    try {
        const { input } = req.params;
        const user = req.user; // current user

        const channel = await userObject.getUser(input);
        if (channel?.message) {
            return res.status(BAD_REQUEST).json({ message: "CHANNEL_NOT_FOUND" });
        }

        const channelProfile = await userObject.getChannelProfile(channel?.user_id, user?.user_id);
        return res.status(OK).json(channelProfile);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while getting the channel profile.",
            error: err.message,
        });
    }
};

const updateAccountDetails = async (req, res) => {
    try {
        const { user_id, user_password } = req.user;
        const { firstName, lastName, email, password } = req.body;

        if (!user_id) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_USERID" });
        }

        // ⭐ alreaady done in verifyJWT
        // const user = await userObject.getUser(user_id);
        // if (user?.message) {
        //     return res.status(BAD_REQUEST).json(user);
        // }

        const response = await verifyPassword(password, user_password);
        if (response?.message) {
            return res.status(BAD_REQUEST).json(response);
        }
        const updatedUser = await userObject.updateAccountDetails(user_id, firstName, lastName, email);

        return res.status(OK).json(updatedUser);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while updating account details.",
            error: err.message,
        });
    }
};

const updateChannelDetails = async (req, res) => {
    try {
        const { user_id, user_password } = req.user;
        const { userName, bio, password } = req.body;

        if (!user_id) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_USERID" });
        }

        // ⭐ alreaady done in verifyJWT
        // const user = await userObject.getUser(user_id);
        // if (user?.message) {
        //     return res.status(BAD_REQUEST).json(user);
        // }

        const response = await verifyPassword(password, user_password);
        if (response?.message) {
            return res.status(BAD_REQUEST).json(response);
        }
        const updatedUser = await userObject.updateChannelDetails(user_id, userName, bio);

        return res.status(OK).json(updatedUser);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while updating channel details.",
            error: err.message,
        });
    }
};

const updatePassword = async (req, res) => {
    try {
        const { user_id, user_password } = req.user;
        const { oldPassword, newPassword } = req.body;

        if (!user_id) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_USERID" });
        }

        // ⭐ alreaady done in verifyJWT
        // const user = await userObject.getUser(user_id);
        // if (user?.message) {
        //     return res.status(BAD_REQUEST).json(user);
        // }

        const response = await verifyPassword(oldPassword, user_password);
        if (response?.message) {
            return res.status(BAD_REQUEST).json(response);
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        const updatedUser = await userObject.updatePassword(user_id, hashedNewPassword);

        return res.status(OK).json({ message: "PASSWORD_UPDATED_SUCCESSFULLY" });
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while updating password.",
            error: err.message,
        });
    }
};

const updateAvatar = async (req, res) => {
    try {
        const { user_id, user_avatar } = req.user;

        if (!user_id) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_USERID" });
        }

        if (!req.file) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_AVATAR" });
        }

        const avatarLocalPath = req.file.path;
        if (!avatarLocalPath) {
            throw new Error({ message: "AVATAR_LOCALPATH_MULTER_ISSUE" });
        }

        const avatar = await uploadOnCloudinary(avatarLocalPath);
        if (!avatar) {
            return res.status(500).json({ message: "AVATAR_UPLOAD_CLOUDINARY_ISSUE" });
        }
        const avatarURL = avatar.url;
        const updatedUser = await userObject.updateAvatar(user_id, avatarURL);

        if (updatedUser) {
            const response = await deleteFromCloudinary(user_avatar);
            if (response.result !== "ok") {
                return res.status(500).json({ message: "OLD_AVATAR_DELETION_CLOUDINARY_ISSUE" });
            }
        }

        return res.status(OK).json(updatedUser);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while updating avatar.",
            error: err.message,
        });
    }
};

const updateCoverImage = async (req, res) => {
    try {
        const { user_id, user_coverImage } = req.user;

        if (!user_id) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_USERID" });
        }

        if (!req.file) {
            return res.status(BAD_REQUEST).json({ message: "MISSING_COVERIMAGE" });
        }

        const coverImageLocalPath = req.file.path;
        if (!coverImageLocalPath) {
            throw new Error({ message: "COVERIMAGE_LOCALPATH_MULTER_ISSUE" });
        }

        const coverImage = await uploadOnCloudinary(coverImageLocalPath);
        if (!coverImage) {
            return res.status(500).json({ message: "COVERIMAGE_UPLOAD_CLOUDINARY_ISSUE" });
        }

        const coverImageURL = coverImage.url;
        const updatedUser = await userObject.updateCoverImage(user_id, coverImageURL);

        if (updatedUser) {
            const response = await deleteFromCloudinary(user_coverImage);
            if (response.result !== "ok") {
                return res.status(500).json({ message: "OLD_COVERIMAGE_DELETION_CLOUDINARY_ISSUE" });
            }
        }

        return res.status(OK).json(updatedUser);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while updating coverImage.",
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
};