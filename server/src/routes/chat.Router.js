import express from 'express';
import {
    verifyJwt,
    validateUUID,
    doesResourceExist,
} from '../middlewares/index.js';
import {
    createGroup,
    deleteChat,
    renameGroup,
    leaveGroup,
    addMembers,
    removeMember,
    getMyChats,
    getMyGroups,
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

chatRouter
    .route('/:chatId')
    .delete(doesChatExist, deleteChat)
    .get(validateUUID('chatId'), getChatDetails);

chatRouter.route('/').get(getMyChats);
