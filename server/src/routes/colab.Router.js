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

// const doesOpponentExist = doesResourceExist('user', 'opponentId', 'opponent');

colabRouter.use(verifyJwt);

