import express from 'express';
export const commentRouter = express.Router();
import { verifyJwt, optionalVerifyJwt } from '../middlewares/index.js';
import {
    addComment,
    updateComment,
    deleteComment,
    getComments,
    getComment,
} from '../controllers/comment.Controller.js';

commentRouter.route('/post/:postId').get(optionalVerifyJwt, getComments);

commentRouter.use(verifyJwt);

commentRouter.route('/:postId').post(addComment);

commentRouter
    .route('/comment/:commentId')
    .patch(updateComment)
    .delete(deleteComment)
    .get(getComment);
