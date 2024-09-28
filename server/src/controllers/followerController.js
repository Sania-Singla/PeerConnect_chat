import { validate as isValiduuid } from "uuid";
import { BAD_REQUEST, SERVER_ERROR, OK } from "../constants/errorCodes.js";
import getServiceObject from "../db/serviceObjects.js";
import { userObject } from "./userController.js";

export const followerObject = getServiceObject("followers");

const getFollowers = async (req, res) => {
    try {
        const { channelId } = req.params;
        if (!channelId || !isValiduuid(channelId)) {
            return res.status(BAD_REQUEST).json({ message: "CHANNELID_MISSING_OR_INVALID" });
        }

        const channel = await userObject.getUser(channelId);
        if (channel?.message) {
            return res.status(BAD_REQUEST).json({ message: "CHANNEL_NOT_FOUND" });
        }

        const response = await followerObject.getFollowers(channelId);
        return res.status(OK).json(response);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while fetching the total followers",
            error: err.message,
        });
    }
};

const getFollowings = async (req, res) => {
    try {
        const { channelId } = req.params;
        if (!channelId || !isValiduuid(channelId)) {
            return res.status(BAD_REQUEST).json({ message: "CHANNELID_MISSING_OR_INVALID" });
        }

        const channel = await userObject.getUser(channelId);
        if (channel?.message) {
            return res.status(BAD_REQUEST).json({ message: "CHANNEL_NOT_FOUND" });
        }

        const response = await followerObject.getFollowings(channelId);
        return res.status(OK).json(response);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while fetching the total followings",
            error: err.message,
        });
    }
};

const toggleFollow = async (req, res) => {
    try {
        const { channelId } = req.params;
        const { user_id } = req.user;

        if (!channelId || !isValiduuid(channelId)) {
            return res.status(BAD_REQUEST).json({ message: "CHANNELID_MISSING_OR_INVALID" });
        }
        if (!user_id) {
            return res.status(BAD_REQUEST).json({ message: "USERID_MISSING" });
        }

        const channel = await userObject.getUser(channelId);
        if (channel?.message) {
            return res.status(BAD_REQUEST).json({ message: "CHANNEL_NOT_FOUND" });
        }

        const response = await followerObject.toggleFollow(user_id, channelId);
        return res.status(OK).json(response);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: "something went wrong while toggling follow",
            error: err.message,
        });
    }
};

export { getFollowers, getFollowings, toggleFollow };
