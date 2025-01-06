import express from 'express';
import { verifyJwt, doesResourceExist } from '../middlewares/index.js';
import {
    addChat,
    deleteChat,
    getChats,
} from '../controllers/chat.Controller.js';

export const chatRouter = express.Router();

const doesUserExist = doesResourceExist('user', 'userId', 'otherUser');
const doesChatExist = doesResourceExist('chat', 'chatId', 'chat');

chatRouter.use(verifyJwt);

chatRouter.route('/add/:userId').post(doesUserExist, addChat);

chatRouter.route('/delete/:chatId').delete(doesChatExist, deleteChat);

chatRouter.route('/').get(getChats);
