import express from 'express';
import { doesResourceExist, upload, verifyJwt } from '../middlewares/index.js';
import {
    getMessages,
    sendMessage,
    editMessage,
    deleteMessage,
} from '../controllers/message.Controller.js';

export const messageRouter = express.Router();

const doesChatExist = doesResourceExist('chat', 'chatId', 'chat');
const doesMessageExist = doesResourceExist('message', 'messageId', 'message');

messageRouter.use(verifyJwt);

messageRouter
    .route('/:chatId')
    .all(doesChatExist)
    .get(getMessages)
    .post(upload.array('attachments', 5), sendMessage);

messageRouter
    .route('/:messageId')
    .all(doesMessageExist)
    .patch(editMessage)
    .delete(deleteMessage);
