import express from 'express';
export const commentRouter = express.Router();
import {
    verifyJwt,
    optionalVerifyJwt,
    isOwner,
    doesResourceExist,
} from '../middlewares/index.js';
import {
    addComment,
    updateComment,
    deleteComment,
    getComments,
    getComment,
} from '../controllers/comment.Controller.js';

const isCommentOwner = isOwner('comment', 'user_id');
const doesPostExist = doesResourceExist('post', 'postId', 'post');
const doesCommentExist = doesResourceExist('comment', 'commentId', 'comment');

commentRouter
    .route('/post/:postId')
    .get(doesPostExist, optionalVerifyJwt, getComments);

commentRouter.route('/:postId').post(doesPostExist, verifyJwt, addComment);

commentRouter
    .route('/comment/:commentId')
    .all(doesCommentExist)
    .get(optionalVerifyJwt, getComment)
    .patch(verifyJwt, isCommentOwner, updateComment)
    .delete(verifyJwt, isCommentOwner, deleteComment);
