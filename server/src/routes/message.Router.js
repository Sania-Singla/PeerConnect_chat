import express from 'express';
import { verifyJwt } from '../middlewares/index.js';
import { sendMessage } from '../controllers/message.Controller.js';

export const messageRouter = express.Router();

messageRouter.use(verifyJwt);

messageRouter.route('/send/:recieverId').post(sendMessage);
messageRouter.route('/messages/:recieverId').post(sendMessage);