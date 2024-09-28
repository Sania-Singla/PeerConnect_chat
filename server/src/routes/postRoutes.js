import express from "express";
export const postRouter = express.Router();
import { upload, verifyJwt, optionalVerifyJwt } from "../middlewares/index.js";

import {
    getPost,
    getPosts,
    getRandomPosts,
    addPost,
    deletePost,
    updatePostDetails,
    updatePostImage,
    togglePostVisibility,
} from "../controllers/postController.js";

postRouter.route("/all").get(getRandomPosts);

postRouter.route("/user/:userId").get(getPosts);

postRouter.route("/:postId").get(optionalVerifyJwt, getPost);

postRouter.use(verifyJwt);

postRouter.route("/add").post(upload.single("postImage"), addPost);

postRouter.route("/delete/:postId").delete(deletePost);

postRouter.route("/update-details/:postId").patch(updatePostDetails);

postRouter.route("/update-image/:postId").patch(upload.single("postImage"), updatePostImage);

postRouter.route("/toggle-visibility/:postId").patch(togglePostVisibility);
