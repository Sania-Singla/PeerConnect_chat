import express from 'express';
import { verifyJwt, doesResourceExist } from '../middlewares/index.js';
import {
    createGroup,
    deleteGroup,
    leaveGroup,
    removeSomeoneFromGroup,
    addSomeoneToGroup,
    promoteSomeoneToAdmin,
} from '../controllers/groupChat.Controller.js';

export const groupChatRouter = express.Router();

const doesColabExist = doesResourceExist('colab', 'colabId', 'colab');
const doesOtherUserExist = doesResourceExist('user', 'userId', 'otherUser');

groupChatRouter.use(verifyJwt);

groupChatRouter.route('/group/create').post(createGroup);

groupChatRouter
    .route('/group/delete/:colabId')
    .delete(doesColabExist, deleteGroup);

groupChatRouter
    .route('/group/leave/:colabId')
    .patch(doesColabExist, leaveGroup);

groupChatRouter
    .route('/group/add-member/:colabId/:userId')
    .patch(doesColabExist, doesOtherUserExist, addSomeoneToGroup);

groupChatRouter
    .route('/group/remove-member/:colabId/:userId')
    .patch(doesColabExist, doesOtherUserExist, removeSomeoneFromGroup);

groupChatRouter
    .route('/group/promote/:colabId/:userId')
    .patch(doesColabExist, doesOtherUserExist, promoteSomeoneToAdmin);
