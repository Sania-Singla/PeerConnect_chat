import express from 'express';
export const likeRouter = express.Router();
import { verifyJwt, doesResourceExist } from '../middlewares/index.js';
import {
    getLikedPosts,
    toggleCommentLike,
    togglePostLike,
} from '../controllers/like.Controller.js';

const doesPostExist = doesResourceExist('post', 'postId', 'post');
const doesCommentExist = doesResourceExist('comment', 'commentId', 'comment');

likeRouter.use(verifyJwt);

likeRouter.route('/').get(getLikedPosts);

likeRouter
    .route('/toggle-post-like/:postId')
    .patch(doesPostExist, togglePostLike);

likeRouter
    .route('/toggle-comment-like/:commentId')
    .patch(doesCommentExist, toggleCommentLike);
