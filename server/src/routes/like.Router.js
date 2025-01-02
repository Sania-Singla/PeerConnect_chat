import express from 'express';
export const likeRouter = express.Router();
import {
    verifyJwt,
    doesCommentExist,
    doesPostExist,
} from '../middlewares/index.js';
import {
    getLikedPosts,
    toggleCommentLike,
    togglePostLike,
} from '../controllers/like.Controller.js';

likeRouter.use(verifyJwt);

likeRouter.route('/').get(getLikedPosts);

likeRouter
    .route('/toggle-post-like/:postId')
    .patch(doesPostExist, togglePostLike);

likeRouter
    .route('/toggle-comment-like/:commentId')
    .patch(doesCommentExist, toggleCommentLike);
