import express from 'express';
import { verifyJwt, doesResourceExist } from '../middlewares/index.js';
import {
    addChat,
    deleteChat,
    deleteMessage,
    sendMessage,
    getMessages,
    getChats,
} from '../controllers/chat.Controller.js';

export const chatRouter = express.Router();

const doesUserExist = doesResourceExist('user', 'userId', 'otherUser');

chatRouter.use(verifyJwt);

chatRouter.route('/add/:userId').post(doesUserExist, addChat);

chatRouter.route('/delete/:chatId').delete(doesChatExist, deleteChat);

chatRouter.route('/messages/:chatId').get(doesChatExist, getMessages);

chatRouter.route('/message/send/:chatId').post(doesChatExist, sendMessage);

chatRouter
    .route('/message/delete/:messageId')
    .delete(doesMessageExist, deleteMessage);

chatRouter.route('/').get(getChats);
