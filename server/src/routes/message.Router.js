import express from 'express';
import { verifyJwt, doesResourceExist } from '../middlewares/index.js';
import { sendMessage, getMessages } from '../controllers/message.Controller.js';

export const messageRouter = express.Router();

const doesReciverExist = doesResourceExist('user', 'reciverId', 'reciver');

messageRouter.use(verifyJwt);

messageRouter
    .route('/:recieverId')
    .get(doesReciverExist, getMessages)
    .post(doesReciverExist, sendMessage);
