import express from 'express';
import { verifyJwt, doesResourceExist } from '../middlewares/index.js';
import {
    addChat,
    deleteChat,
    getChats,
    getChat,
} from '../controllers/chat/chat.Controller.js';

export const chatRouter = express.Router();

const doesUserExist = doesResourceExist('user', 'userId', 'otherUser');
const doesChatExist = doesResourceExist('chat', 'chatId', 'chat');

chatRouter.use(verifyJwt);

chatRouter.route('/add/:userId').post(doesUserExist, addChat);

chatRouter.route('/:chatId').delete(doesChatExist, deleteChat).get(getChat);

chatRouter.route('/').get(getChats);
