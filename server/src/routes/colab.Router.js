import express from 'express';
import { verifyJwt, doesResourceExist } from '../middlewares/index.js';
import {
    addCollaboration,
    removeCollaboration,
    createGroup,
    deleteGroup,
    leaveGroup,
    removeSomeoneFromGroup,
    addSomeoneToGroup,
    promoteSomeoneToAdmin,
} from '../controllers/message.Controller.js';

export const colabRouter = express.Router();

const doesColabExist = doesResourceExist('colab', 'colabId', 'colab');
const doesOtherUserExist = doesResourceExist('user', 'userId', 'otherUser');

colabRouter.use(verifyJwt);

colabRouter
    .route('/colaboration/add/:userId')
    .post(doesOtherUserExist, addCollaboration);

colabRouter
    .route('/remove/:colabId')
    .delete(doesColabExist, removeCollaboration);

colabRouter.route('/group/create').post(createGroup);

colabRouter.route('/group/delete/:colabId').delete(doesColabExist, deleteGroup);

colabRouter.route('/group/leave/:colabId').patch(doesColabExist, leaveGroup);

colabRouter
    .route('/group/add-member/:colabId/:userId')
    .patch(doesColabExist, doesOtherUserExist, addSomeoneToGroup);

colabRouter
    .route('/group/remove-member/:colabId/:userId')
    .patch(doesColabExist, doesOtherUserExist, removeSomeoneFromGroup);

colabRouter
    .route('/group/promote/:colabId/:userId')
    .patch(doesColabExist, doesOtherUserExist, promoteSomeoneToAdmin);
