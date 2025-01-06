import express from 'express';
import { verifyJwt, doesResourceExist } from '../middlewares/index.js';
import { sendMessage, getMessages } from '../controllers/chat.Controller.js';

export const chatRouter = express.Router();

const doesOtherUserExist = doesResourceExist('user', 'userId', 'otherUser');

chatRouter.use(verifyJwt);

chatRouter
    .route('/:userId')
    .get(doesOtherUserExist, getMessages)
    .post(doesOtherUserExist, sendMessage);
