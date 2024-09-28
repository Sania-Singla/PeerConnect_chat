import express from "express";
export const followerRouter = express.Router();
import { verifyJwt } from "../middlewares/authMiddleware.js";

import { getFollowers, getFollowings, toggleFollow } from "../controllers/followerController.js";

followerRouter.route("/followedBy/:channelId").get(getFollowers);

followerRouter.route("/follows/:channelId").get(getFollowings);

followerRouter.route("/toggle/:channelId").patch(verifyJwt, toggleFollow);
