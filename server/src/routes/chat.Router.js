import express from 'express';
import {
    verifyJwt,
    validateUUID,
    doesResourceExist,
} from '../middlewares/index.js';
import {
    sendRequest,
    acceptRequest,
    rejectRequest,
    createGroup,
    deleteChat,
    renameGroup,
    leaveGroup,
    addMembers,
    removeMember,
    getMyChats,
    getMyGroups,
    getGroupDetails,
} from '../controllers/chat.Controller.js';

export const chatRouter = express.Router();

const doesRequestExist = doesResourceExist('request', 'requestId', 'request');
const doesChatExist = doesResourceExist('chat', 'chatId', 'chat');

chatRouter.use(verifyJwt);

chatRouter
    .route('/requests/send/userId')
    .post(validateUUID('userId'), sendRequest);

chatRouter
    .route('/requests/accept/requestId')
    .patch(doesRequestExist, acceptRequest);

chatRouter
    .route('/requests/reject/requestId')
    .patch(doesRequestExist, rejectRequest);

chatRouter.route('/groups/new').post(createGroup);

chatRouter.route('/groups/leave/:chatId').patch(doesChatExist, leaveGroup);

chatRouter.route('/groups/rename/:chatId').patch(doesChatExist, renameGroup);

chatRouter.route('/groups/members/add').patch(doesChatExist, addMembers);

chatRouter.route('/groups/members/remove').patch(doesChatExist, removeMember);

chatRouter.route('/groups/:chatId').get(getGroupDetails);

chatRouter.route('/groups').get(getMyGroups);

chatRouter.route('/:chatId').delete(doesChatExist, deleteChat);

chatRouter.route('/').get(getMyChats);
