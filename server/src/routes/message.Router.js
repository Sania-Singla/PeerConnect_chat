import express from 'express';
import { verifyJwt, doesResourceExist } from '../middlewares/index.js';
import {
    deleteMessage,
    sendMessage,
    getMessages,
} from '../controllers/chat/message.Controller.js';

export const messageRouter = express.Router();

const doesChatExist = doesResourceExist('chat', 'chatId', 'chat');
const doesMessageExist = doesResourceExist('message', 'messageId', 'message');

messageRouter.use(verifyJwt);

messageRouter
    .route('/:chatId')
    .all(doesChatExist)
    .get(getMessages)
    .post(sendMessage);

messageRouter.route('/:messageId').delete(doesMessageExist, deleteMessage); // can have edit message too
