import express from 'express';
import { verifyJwt, doesResourceExist } from '../middlewares/index.js';
import {
    sendMessage,
    getMessages,
} from '../controllers/individualChat.Controller.js';

export const individualChatRouter = express.Router();

const doesOtherUserExist = doesResourceExist('user', 'userId', 'otherUser');

individualChatRouter.use(verifyJwt);

individualChatRouter
    .route('/:userId')
    .get(doesOtherUserExist, getMessages)
    .post(doesOtherUserExist, sendMessage);
