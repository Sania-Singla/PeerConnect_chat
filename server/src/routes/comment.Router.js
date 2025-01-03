import express from 'express';
export const commentRouter = express.Router();
import {
    verifyJwt,
    optionalVerifyJwt,
    isCommentOwner,
    doesPostExist,
    doesCommentExist,
} from '../middlewares/index.js';
import {
    addComment,
    updateComment,
    deleteComment,
    getComments,
    getComment,
} from '../controllers/comment.Controller.js';

commentRouter
    .route('/post/:postId')
    .get(doesPostExist, optionalVerifyJwt, getComments);

commentRouter.route('/:postId').post(doesPostExist, verifyJwt, addComment);

commentRouter
    .route('/comment/:commentId')
    .get(doesCommentExist, optionalVerifyJwt, getComment)
    .patch(doesCommentExist, isCommentOwner, verifyJwt, updateComment)
    .delete(doesCommentExist, isCommentOwner, verifyJwt, deleteComment);
