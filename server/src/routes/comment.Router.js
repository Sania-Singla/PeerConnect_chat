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

commentRouter.use(verifyJwt);

commentRouter.route('/:postId').post(doesPostExist, addComment);

commentRouter
    .route('/comment/:commentId')
    .get(doesCommentExist, getComment)
    .patch(doesCommentExist, isCommentOwner, updateComment)
    .delete(doesCommentExist, isCommentOwner, deleteComment);
