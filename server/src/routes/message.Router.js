import express from 'express';
import { verifyJwt, doesResourceExist } from '../middlewares/index.js';
import { sendMessage, getMessages } from '../controllers/message.Controller.js';

export const messageRouter = express.Router();

const doesOtherUserExist = doesResourceExist('user', 'userId', 'otherUser');

messageRouter.use(verifyJwt);

messageRouter
    .route('/:userId')
    .get(doesOtherUserExist, getMessages)
    .post(doesOtherUserExist, sendMessage);
