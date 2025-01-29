import express from 'express';
import { verifyJwt, doesResourceExist } from '../middlewares/index.js';
import {
    createGroup,
    deleteChat,
    renameGroup,
    leaveGroup,
    addMembers,
    removeMember,
    getMyChats,
    getMyGroups,
    getMyFriends,
    getChatDetails,
    makeAdmin,
} from '../controllers/chat.Controller.js';

export const chatRouter = express.Router();

const doesChatExist = doesResourceExist('chat', 'chatId', 'chat');

chatRouter.use(verifyJwt);

chatRouter.route('/groups/new').post(createGroup);

chatRouter.route('/groups/leave/:chatId').patch(doesChatExist, leaveGroup);

chatRouter.route('/groups/rename/:chatId').patch(doesChatExist, renameGroup);

chatRouter
    .route('/groups/members/add/:chatId')
    .patch(doesChatExist, addMembers);

chatRouter
    .route('/groups/members/remove/:chatId/:userId')
    .patch(doesChatExist, removeMember);

chatRouter
    .route('/groups/members/admin/:chatId/:userId')
    .patch(doesChatExist, makeAdmin);

chatRouter.route('/groups').get(getMyGroups);

chatRouter.route('/friends').get(getMyFriends);

chatRouter
    .route('/:chatId')
    .all(doesChatExist)
    .delete(deleteChat)
    .get(getChatDetails);

chatRouter.route('/').get(getMyChats);
