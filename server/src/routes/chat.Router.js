import express from 'express';
import { verifyJwt, doesResourceExist } from '../middlewares/index.js';
import {
    addChat,
    deleteChat,
    getChats,
    getChat,
    createGroup,
    deleteGroup,
    leaveGroup,
    removeSomeoneFromGroup,
    addSomeoneToGroup,
    promoteSomeoneToAdmin,
} from '../controllers/chat.Controller.js';

export const chatRouter = express.Router();

const doesUserExist = doesResourceExist('user', 'userId', 'otherUser');
const doesChatExist = doesResourceExist('chat', 'chatId', 'chat');

chatRouter.use(verifyJwt);

chatRouter.route('/add/:userId').post(doesUserExist, addChat);

chatRouter.route('/:chatId').all(doesChatExist).delete(deleteChat).get(getChat);

chatRouter.route('/').get(getChats);

const doesColabExist = doesResourceExist('colab', 'colabId', 'colab');
const doesOtherUserExist = doesResourceExist('user', 'userId', 'otherUser');

chatRouter.use(verifyJwt);

chatRouter.route('/group/create').post(createGroup);

chatRouter.route('/group/delete/:colabId').delete(doesColabExist, deleteGroup);

chatRouter.route('/group/leave/:colabId').patch(doesColabExist, leaveGroup);

chatRouter
    .route('/group/add-member/:colabId/:userId')
    .patch(doesColabExist, doesOtherUserExist, addSomeoneToGroup);

chatRouter
    .route('/group/remove-member/:colabId/:userId')
    .patch(doesColabExist, doesOtherUserExist, removeSomeoneFromGroup);

chatRouter
    .route('/group/promote/:colabId/:userId')
    .patch(doesColabExist, doesOtherUserExist, promoteSomeoneToAdmin);
